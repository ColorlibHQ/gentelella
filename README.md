# gentelella [![Build Status](https://travis-ci.org/funilrys/gentelella.svg?branch=dev-sass)](https://travis-ci.org/funilrys/gentelella)

This fork exists to redesign and fix the broken structure of original *gentelella* project.

The origin of this work is in the issue [#406 Using & developing this template is a nightmare](https://github.com/puikinsh/gentelella/issues/406)


## How to develop

1. Install all the dependencies `npm install`
2. Install **gulp globally** `npm install -g gulp`
3. Run the dev server simply calling `gulp`
4. Change the files!

## How to test

We are working hard to bring CI tools to this project as well as tests.

Unfortunately, current state of the project does not allow for automatic tests to be made.
Currently there is only a manual (but quick) way to compare your results with **CSS regresstion tests** made with [PhantomCSS](https://github.com/Huddle/PhantomCSS).

To run the tests:

1. Install all the dependencies `npm install`
2. Install **phantomjs and casperjs globally** `npm install -g phantomjs casperjs`
3. Run the tests with `npm test`

Sorry for leaving the `http-server` running after the tests. On CI it does not matter.
You can kill it with: 
```
ps aux | grep 'http-server' | head -1 | cut -d " " -f 2 | xargs kill
```

The tests output should be visible in the `./test/screenshots/desktop`.
See the screens and you will figure out how it works.


## Contributors

If you would like to participate in our work, you are more then welcome! 
Please fork this repository or create an issue describing what would you like to share.
   
Current list of contributors:

- [@atais](https://github.com/atais)
- [@draecko](https://github.com/draecko)
