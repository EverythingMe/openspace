var App = function(_cfg) {
  var cfg = {
    dataPath: 'data/projects.json',
    projectsSel: '#projects',
    tagsSel: '#tag-filter'
  };
  for (var k in _cfg) {
    cfg[k] = _cfg[k];
  }

  var projectsEl = $(cfg.projectsSel);

  $.ajax(cfg.dataPath)
    .done(function(d) {
      normalizeData(d);
      initTags(d);
      initProjects(d);
      initAffix();
    });

  window.onresize = initAffix;

  // mark ios
  if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
    document.body.dataset.os = 'ios';
  }

  function normalizeData(data) {
    data.forEach(function(p) {
      p.tags = p.tags.map(function(tag) {
        return {'name': tag};
      });
    });
  }

  function initTags(data) {
    var tags = [];
    data.forEach(function(p) {
      tags = tags.concat(p.tags)
    });
    tags = _.uniq(tags, function(t){
      return JSON.stringify(t);
    });

    var source   = $('#tag-filter-template').html();
    var template = Handlebars.compile(source);
    var html = template({ 'tags': tags })

    $('#tag-filter').append(html)
  }

  function initProjects(data) {
    var source   = $('#project-template').html();
    var template = Handlebars.compile(source);
    var html = template({ 'projects': data })

    projectsEl
      .prepend(html)
      .mixItUp({
        animation: {
          duration: 400,
          effects: 'fade translateZ(-360px) stagger(34ms)',
          easing: 'ease'
        }
      });
  }

  function initAffix() {
    console.log(1);
    $('#affix').affix({
      offset: {
        top: function () {
          return (this.top = $('header').outerHeight(true))
        }
      }
    })
  }

  var filter = function(name, forceFilter) {
    if (projectsEl.mixItUp('isMixing')) return;

    var state = projectsEl.mixItUp('getState');
    var currTag = $('[data-tag="'+state.activeFilter+'"]');
    var newTag = $('[data-tag="'+name+'"]');
    var toggleClassName = "active";

    if (state.activeFilter == name) {
      if (forceFilter) { return; }
      projectsEl.mixItUp('filter', 'all');
    } else {
      projectsEl.mixItUp('filter', name);
      currTag.toggleClass(toggleClassName);
    }
    newTag.toggleClass(toggleClassName);
  };

  return {
    filter: filter
  };
};

Handlebars.registerHelper('color', function(str) {
  return getMaterialColor(str);
});

Handlebars.registerHelper('rgb', function(str) {
  var color = getMaterialColor(str);
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  color = parseInt(result[1], 16)+','+parseInt(result[2], 16)+','+parseInt(result[3], 16);
  return color;
});

// swaps errornous chars with '-'
Handlebars.registerHelper('escape', function(str) {
  if (str)
    return str.replace(/:|;|\\|\//, '-');
  return str;
});
