# Openspace

Openspace is a web app to showcase your open source projects on GitHub.

We’ve reached a point where EverythingMe's organization profile on GitHub holds a combination of internal tools, forks of projects we’re using and contributed to and some less interesting bits. We wanted a simple and beatiful way to showcase the projects that are represent our open sourced work.

Shut up and [show me how it looks](http://everythingme.github.io/openspace/)

## Overview

The web app is purely static to allow it to be hosted on GitHub pages, it uses a *projects.json* under */data* folder to determine which projects to display.

While iterating on the design and metadata we're displaying, we created a [tool](https://github.com/EverythingMe/openspace/tree/master/data) to populate the *projects.json* file and also update it (in case you want periodic updates for descriptions / stars and forks counts).

## Getting Started

* Clone and push to *username.github.io* repo.
* Use the [data tool](https://github.com/EverythingMe/openspace/tree/master/data) to create your *projects.json* file.
* Modify the projects.json if needed and test locally (simplest way to run it is to run ```python -m SimpleHTTPServer``` in the root folder and browse to [http://localhost:8000](http://localhost:8000) 
* Push. Profit.

## Acknowledgements

* Bootsrap and [Material Design for Bootstrap](http://fezvrasta.github.io/bootstrap-material-design/) were used for layout, elements, icons and colors.
* The projects grid and animations were implemented using [MixItUp](https://mixitup.kunkalabs.com/).
* [fontello](http://fontello.com/) was used for some of the icons

## License

See [LICENSE](https://github.com/EverythingMe/openspace/blob/master/LICENSE.txt) file.