import { IServer, Server } from "../data/models";
import { log } from '../services/logger';
const bent = require('bent');
const getJSON = bent('json');
import { config } from '../config';
import { EventResponse, Paged } from "../types";
import { processOperation } from "../controllers/identity";

/** Returns all servers registered in the vault. This operation does not do paging as there will normally be a small list of servers. */
export const getServers = () => {
    log.info('Get Server:');
    return Server.find();
}

/** Call method to perform sync operation against a server. */
export const syncEvents = async (server: IServer) => {
    var url = server.url;
    let count = 0;

    try {
        var response = await getJSON(`${url}/event/count`);
        count = response.count;
    }
    catch (err) {
        log.error('Failed to get event count!');
        log.error(err);
        return;
    }

    log.info(`Count on ${server.name} is currently ${count}.`);

    // If the last count we saved is different than the one we just queried, we'll download new events.
    if (count != null && count != server.last.count) {

        const limit = config.sync.limit;
        let page = 1;

        log.info(`Server Last Count: ${server.last.count}`);

        // If we have a previous count persisted, used that to find which page we should continue sync on.
        if (server.last.count) {
            log.info('server.last.count:' + server.last.count);
            log.info('limit:' + limit);
            page = Math.floor(server.last.count / limit) + 1; // This can give decimals, so make sure we always round down.
            log.info('page:' + page);

            // TODO: Verify if this actually skips two pages back after we changed to 1-based index for pages.
            // if (page == 0) {
            //     page = 1;
            // }
        }

        // let page = count / limit;
        let loop = true;

        while (loop) {

            // Sync events until the returned amount if less than the limit, that means we're at the last page.
            let dataUrl = `${url}/event?page=${page}&limit=${limit}`;
            log.info(dataUrl);
            let events: Paged<EventResponse> = await getJSON(dataUrl);

            // Save the events to our database.
            for (const entry of events.data) {
                log.info(JSON.stringify(entry));
                // Process the JWT, don't trust the other data.

                try {
                    await processOperation({
                        sync: true,
                        ...entry
                    });
                } catch (err) {
                    log.error('Error during event sync: ' + err.message);
                }
            }

            // This means we're on the last page.
            if (!events.data.length || events.data.length != limit) {
                log.info('Last page retrieved from server. Saving the last state until next iteration.');

                loop = false;

                // Get the latest entity from storage.
                const serverToUpdate = await Server.findOne({ id: server.id });

                log.info('Updating server...');
                log.info(serverToUpdate);

                if (serverToUpdate) {
                    serverToUpdate.state = "online";
                    serverToUpdate.error = '';
                    serverToUpdate.lastSync = new Date();
                    serverToUpdate.last.count = count;
                    serverToUpdate.last.page = page;
                    serverToUpdate.last.limit = limit;
                    await serverToUpdate.save();
                }
            }

            page++;
        }
    }
    else {
        log.info(`The count for ${server.name} is ${count} which is same as before, or null.`);
    }

    log.info('Finished sync with vault');
};