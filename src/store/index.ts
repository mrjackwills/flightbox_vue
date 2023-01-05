import { aircraftStore } from '@/store/modules/aircraft';
import { dialogStore } from '@/store/modules/dialog';
import { flightboxStatusStore } from '@/store/modules/flightboxStatus';
import { loadingStore } from '@/store/modules/loading';
import { snackbarStore } from '@/store/modules/snackbar';
import { userStore } from '@/store/modules/user';
import { websocketStore } from '@/store/modules/websocket';

export const aircraftModule = aircraftStore;
export const dialogModule = dialogStore;
export const flightboxStatusModule = flightboxStatusStore;
export const loadingModule = loadingStore;
export const snackbarModule = snackbarStore;
export const userModule = userStore;
export const websocketModule = websocketStore;