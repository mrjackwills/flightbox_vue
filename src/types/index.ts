type name_status = 'status';
type name_flights = 'flights';
type TWSToFlightboxNames = 'on' | 'off' | name_status | name_flights;

type TAircraftAltitude = {
	aircraft: TAircraft;
	altitude: number;
	callsign?: string;
};
type TAircraft = Record<'mode_s' | 'registered_owner' | 'registered_owner_operator_flag_code' | 'registered_owner_country_name' | 'registered_owner_country_iso_name' |
  'manufacturer' | 'type' | 'icao_type' | 'url_photo' | 'url_photo_thumbnail', string>;

type adsbdb_string = 'country_name' | 'country_iso_name' | 'municipality' | 'icao_code' | 'iata_code' | 'name';
type adsbdb_number = `latitude` | `longitude` | 'elevation';

type adsbdb_flightroute = Record<adsbdb_string, string> & Record<adsbdb_number, number>;

export type u<T> = T | undefined;
export type su = u<string>;
export type nu = u<number>;

export type TConvertBytes = {
	total: string;
	unit: 'GB' | 'MB' | 'kB';
};

export type TDataToDisplay = Array<Array<Record<'icon' | 'text' | 'value', string> & { copy: boolean }>>;

export type TError = {
	message: string;
	code: number;
};

export type TStatus = {
	message: name_status;
	data: TFlightboxStatus;
};

export type TWSFlights = {
	message: name_flights;
	data: Array<TAdsbdb>;
};

export type TSnackbarModule = {
	loading: boolean;
	icon: su;
	message: su;
	timeout: nu;
	visible: boolean;
};

export type TSnack = {
	message?: string;
	icon?: string;
	timeout?: number;
	loading?: boolean;
};

export type TWSFromFlightBox = {
	data?: TStatus | TWSFlights;
	cache?: boolean;
	unique?: boolean;
	error?: TError;
};

export type TWSToServer = { message: TWSToFlightboxNames };

export type TFlightboxStatus = Record<'internal_ip' | 'time' | 'api_version', string> &
  Record<'uptime' | 'uptime_app' | 'uptime_ws', number> &
  { screen_on: boolean };

export type TFlightRoute = {
	origin: adsbdb_flightroute;
	destination: adsbdb_flightroute;
	midpoint?: adsbdb_flightroute;
};

export type TAdsbdb = TAircraftAltitude & { flightroute?: TFlightRoute };

export type TSortBy = 'altitude' | 'aircraft' | 'owner' | 'callsign';

export type TFlights = { current_flights: Array<TAdsbdb> };

export type TFlightRouteRow = Record<'icao' | 'iata' | 'name' | 'country_name' | 'municipality', string>;
