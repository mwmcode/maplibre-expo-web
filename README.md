- `npm install`
- `expo prebuild --clean`
- start an **iOS 18.2** simulator

```sh
xcrun simctl boot "iPhone 16 Pro"
# then..
open -a Simulator
```

- build release config (into dist/ios)

```sh
xcodebuild -workspace ios/aadbug.xcworkspace -scheme aadbug -configuration Release -sdk iphonesimulator -derivedDataPath dist/ios
```

- install the build the booted simulator

```sh
xcrun simctl install booted dist/ios/Build/Products/Release-iphonesimulator/aadbug.app
```
