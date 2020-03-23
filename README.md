# todo-react-typescript-subsecond
Tiny Todo app in React and TypeScript demonstrating sub-second test feedback

## Start the app

    npm start

## Run tests

    npm test

### Run tests in a particular assembly

    # Look for possible values in features/support/TodoWorld.ts
    ASSEMBLY=... ./cucumber

### Run Cucumber-Electron interactively

    ASSEMBLY=react ./cucumber -i

Keep each actor's DOM (omit cleaning up)

    ASSEMBLY=react KEEP_DOM=1 ./cucumber -i

## Patterns

### Test code

* Step definitions only interact with an `actor`
  * No information about UI or technology "leaks" through its API
  * There are multiple implementations of `IActor`
* `Then` steps are synchronous
  * It's previous steps' responsibility to ensure the system is in a "settled" state
  * The `ReactActor` and `WebDriverActor` implementation uses [@cucumber/microdata](https://github.com/cucumber/microdata) to query the DOM
* Reuse "heavy" resources between scenarios
  * The same WebDriver browser instance (takes time to launch a new browser)
  * The same Server (takes time to run webpack). No webpack is used in react-http mode, but it's simpler to share the server anyway

### Production code

* The React app is completely decoupled from the network (HTTP)
  * React hooks for writing/reading data to/from the server - defined as custom types
  * Different implementations of these hooks - HTTP and direct in-memory access
  * The hook implementatins are injected into the React app during assembly

### Webinar script

* Beginning
    * Why Cucumber
    * Why CBT
    * Why Sub-Second important
* Middle
    * Demo + architecture slides
    * Find IE bug
    * Fix it
* End
    * Sum up tradeoff speed/confidence
    * Mention deeper dive into this in future
    * Q/A

* Explain purpose
  * Show BDD workflow with sub-second feedback
  * This webinar only works for Node.js, audience primarily developer
  * With full-stack UI tests (React app + Server)
  * Way for *developers* to get fast feedback
  * Jacob Nielsen: 0.1s, 1, 10s
    * Applies to development - must be < 1s to keep flow
  * WebDriver is fast, but boot time is long
  * We want WebDriver/CBT confidence without latency penalty
  * Why WD slow:
    * Webpack
    * Launch WebDriver's browser
    * I/O
  * What if we could do away with that
    * Run client+server in the same process
    * No browser (but still a DOM)
  * Electron: Node + Chrome DOM in same process. (Slack, VS Code, Atom and more built on this).
  * Cucumber-Electron: Cucumber.js running in Electron
* Demo the app
* Show architecture diagram (React, Express, maybe DB)
* Show feature

* Run in different assemblies (show architecture diagram for each)
  * Run with Domain
    * Biz logic works
    * Very fast!
    * But: No idea if UI works
  * Run with Electron (no HTTP)
    * UI logic works (input field event handler, rendering of TODOs)
    * Still quite fast
    * But: No idea if React<->Server communication works
  * Run with Electron-HTTP (same process, but still HTTP)
    * React<->Server communication works
    * Getting slow now
    * But: No idea if it works in Safari, Firefox, Chrome, Edge, IE
  * Run with WebDriver Firefox
    * Works in Firefox
    * Painfully slow
    * Still no idea about other browsers. I can't run Edge/IE on my Mac 
  * Run with CBT
    * Find a bug in IE (Promise not supported)

### Coding demo

* Look at how simple these stepdefs are!
* Only talking to an Actor (screenplay pattern lite - shout out to Matt's posts)
* The ASSEMBLY env var is used to pick a specific implementation of IActor

### Talking points

* We can trade confidence level for speed
* I'd never run all tests at the same level as I'm doing in this simple app
* Use tags to run fewer scenarios as we go deeper
  * The only addition confidence with WebDriver / CBT is browser portability
  * Therefore we can run fewer - the lower level assemblies give us sufficient confidence about UI logic, HTTP and biz logic
* We didn't deep dive into how Cucumber-Electron works. Watch out for a new Webinar
  * Microdata

### TODO

* Set up CBT
* Optimise WebDriver for many scenarios
  * Reuse browser
  * Don't rerun webpack for each scenario
  * Will probably see 1-2 orders of magnitude slower than cucumber electron
* Styling
