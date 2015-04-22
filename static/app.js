
Handlebars.registerHelper('color', function(str) {
  return getMaterialColor(str);
});

$.ajax('data/projects.json').done(function(data) {
  // normalize
  data.forEach(function(project) {
    project.tags = project.tags.map(function(tag) {
      return {'name': tag};
    });
  });

  // tag filters
  (function() {
    var tags = [];
    data.forEach(function(project) {
      tags = tags.concat(project.tags)
    });
    tags = _.uniq(tags, function(item){
      return JSON.stringify(item);
    });

    var source   = $('#tag-filter-template').html();
    var template = Handlebars.compile(source);
    var html = template({ 'tags': tags })

    $('#tag-filter').append(html)
  })();

  // projects
  (function() {
    var source   = $('#project-template').html();
    var template = Handlebars.compile(source);
    var html = template({ 'projects': data })

    $('#projects')
      .html(html)
      .mixItUp({
        animation: {
          duration: 400,
          effects: 'fade translateZ(-360px) stagger(34ms)',
          easing: 'ease'
        }
      });
  })();
 });
