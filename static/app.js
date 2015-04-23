
Handlebars.registerHelper('color', function(str) {
  return getMaterialColor(str);
});

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
    });

  var normalizeData = function(data) {
    data.forEach(function(p) {
      p.tags = p.tags.map(function(tag) {
        return {'name': tag};
      });
    });
  };

  var initTags = function(data) {
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
  };

  var initProjects = function(data) {
    var source   = $('#project-template').html();
    var template = Handlebars.compile(source);
    var html = template({ 'projects': data })

    projectsEl
      .html(html)
      .mixItUp({
        animation: {
          duration: 400,
          effects: 'fade translateZ(-360px) stagger(34ms)',
          easing: 'ease'
        }
      });
  };

  var filter = function(name) {
    var state = projectsEl.mixItUp('getState');
    var currTag = $('button[data-tag="'+state.activeFilter+'"]');
    var newTag = $('button[data-tag="'+name+'"]');
    var activeClass = "active btn-success";

    if (state.activeFilter == name) {
      projectsEl.mixItUp('filter', 'all');
      newTag.removeClass(activeClass);
    } else {
      projectsEl.mixItUp('filter', name);
      currTag.removeClass(activeClass);
      newTag.addClass(activeClass);
    }
  };

  return {
    filter: filter
  };
};
