import { Injectable, NgZone } from '@angular/core';
const { v4: uuidv4 } = require('uuid');

export interface EventBusSubscription {
    key: string
    method: string;
}

@Injectable({
    providedIn: 'root'
})
export class EventBusService {
    private consumers = new Map<string, any[]>();

    constructor(private ngZone: NgZone) {

    }

    trigger(method: string, data?: any) {
        console.log('EventBusService:trigger:', method);

        if (!this.consumers.has(method)) {
            console.log('There are zero consumers of:', method);
            return;
        }

        var consumer = this.consumers.get(method);

        // Make sure we execute the listeners in Angular Zone.
        this.ngZone.run(() => {
            consumer?.forEach((c) => {
                c.listener(data);
            });
        });
    }

    /** Add a listener to specific messages that is received in the app. Returns an subscription object that must be used to unlisten. */
    listen(method: string, listener: any): EventBusSubscription {
        let key = uuidv4();

        if (!this.consumers.has(method)) {
            this.consumers.set(method, [{ key, listener }]);
        } else {
            const consumer = this.consumers.get(method);
            consumer?.push({ key, listener });
        }

        return { method, key };
    }

    /** Remove a listener to specific messages. */
    unlisten(subscription: EventBusSubscription | EventBusSubscription[]) {
        // If there is a single entry, we'll turn that into an array.
        if (!Array.isArray(subscription)) {
            subscription = [subscription];
        }

        subscription.forEach(sub => {
            if (!this.consumers.has(sub.method)) {
                console.log('There are no consumers to unlisten to:', sub);
            }
            else {
                const consumer = this.consumers.get(sub.method);

                console.log('REMOVING LISTENER KEY:', sub.key);
                console.log(JSON.stringify(consumer));

                const subscriber = consumer?.findIndex(c => c.key == sub.key) as number;

                console.log('Subscriber Index:', subscriber);

                if (subscriber !== -1) {
                    consumer?.splice(subscriber, 1);
                }

                console.log(JSON.stringify(consumer));
            }
        });
    }
}
