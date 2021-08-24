import { ISetting } from "../data/models/setting";

class VaultState {
  apiKey: string | undefined;
  settings: ISetting | undefined;
}

// Export a new Instance of the VaultState class
export const state = new VaultState();