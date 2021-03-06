// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  virtualizationUrl: 'http://controller-service-vavtar-services.apps.awsopenshift.ne-innovation.com/virtualization-train',
  operationsUrl: 'http://datasaver-vavtar-services.apps.awsopenshift.ne-innovation.com/api/Data/operations',
  operationUrl: 'http://datasaver-vavtar-services.apps.awsopenshift.ne-innovation.com/api/Data/operation',
  priotizeTrainingUrl: 'http://datasaver-vavtar-services.apps.awsopenshift.ne-innovation.com/api/Data/ranker?operation=/WeatherWS/Weather.asmx-GetWeatherByZip',
  rankerUrl: 'http://datasaver-vavtar-services.apps.awsopenshift.ne-innovation.com/api/Data/ranker'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
