# Openspace

Openspace is a web app to showcase your open source projects on GitHub.

We’ve reached a point where EverythingMe's organization profile on GitHub holds a combination of internal tools, forks of projects we’re using and contributed to and some less interesting bits. We wanted a simple and beatiful way to showcase the projects that are represent our open sourced work.

## Overview

The web app is purely static to allow it to be hosted on GitHub pages, it uses a *projects.json* under */data* folder to determine which projects to display.

While iterating on the design and metadata we're displaying, we created a [tool](https://github.com/EverythingMe/openspace/tree/master/data) to populate the *projects.json* file and also update it (in case you want periodic updates for descriptions / stars and forks counts).

## Getting Started

* Clone and push to *username.github.io* repo.
* Use the data tool to create your *projects.json* file.
* Profit.

## Acknowledgements

* The animations were implemented using [MixItUp](https://mixitup.kunkalabs.com/)

## License

See [LICENSE](https://github.com/EverythingMe/openspace/blob/master/LICENSE.txt) file.