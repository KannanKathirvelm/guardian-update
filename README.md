# Navigator Guardian
This project was generated with [Ionic CLI](https://ionicframework.com/docs/cli) and ionic framework version 4.11.7.
## Prerequisites
* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Ionic](https://ionicframework.com/docs/cli),
* [Angular](https://cli.angular.io/),
* [Cordova](https://cordova.apache.org/docs/en/latest/guide/cli/),
* [Capacitor](https://capacitor.ionicframework.com/docs/getting-started/),
* [Android studio](https://developer.android.com/studio/install)
## Project Structure
This project follows the project structure suggested by Ionic CLI
## Browser Installation
* `git clone https://github.com/Gooru/navigator-guardian-mobile.git` this repository
* Install dependencies `yarn install` or `npm install`
* `ionic serve` to start the ionic project. Navigate to `http://localhost:8101/`
## Build in android
Run `ionic cordova platform add android` to add android platform and run `ionic cordova build android` to generate APK.
## Build in ios
Run `ionic cordova platform add ios` to add iOS platform and run `ionic cordova build ios` to generate IPA.
## Build in Browser
Run `ionic cordova platform add browser` to add browser platform and run `ionic cordova build browser` to generate IPA.
## Further help
To get more help on the Ionic CLI use `ionic help` or go check out the [Ionic CLI README](https://github.com/ionic-team/ionic-cli/blob/develop/README.md).

## Add Shared modules 
`git subtree add -P src/app/shared --squash https://username:token@github.com/Gooru/navigator-mobile.git SHARED_BRANCH_NAME` 

## Pull Shared Modules
To pull the shared modules from the navigator learner repo. (only if shared modules are already added)

`git subtree pull --prefix=src/app/shared/ https://github.com/Gooru/navigator-mobile  SHARED_BRANCH_NAME --squash`

## Development
* Install npm packages `npm install`
* Comment the line of `SessionService` import in `shared.module.ts`
* Set `isDevelopmentMode` as true in `enviornment.ts`
* Sync the newly added dependencies, images, environment keys of the learner (only if required)

## Push
* delete and add the `src/app/shared` folders while committing.  
