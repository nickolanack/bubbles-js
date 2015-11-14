'use strict';
var NotificationBubble = new Class({
  Implements: Events,
  initialize: function(title, description, options) {

    var me = this;
    me.options = Object.append({
      window: window
    }, options);


    me.element = (function() {
      var el = new Element('div', {
        'class': 'bubble'
      });
      el.setStyle('top', '-300px');

      var titleEl = new Element('div', {
        'class': 'title'
      });
      el.appendChild(titleEl);
      titleEl.innerHTML = title;

      if (description !== null) {
        var descriptionEl = new Element('div', {
          'class': 'description'
        });
        el.appendChild(descriptionEl);
        descriptionEl.innerHTML = description;

        if (me.options.icon) {
          descriptionEl.appendChild(new Asset.image(me.options.icon));
          el.addClass('hasIcon');
        }
      }

      return el;
    })();
    me.options.window.$$('Body')[0].appendChild(me.element);
    if (!me.options.window.NotificationBubbles) {
      me.options.window.NotificationBubbles = [];
    }
    me.options.window.NotificationBubbles.push(me);
    me.drop(me.element);

  },
  _insertElement: function() {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullscreenElement ||
      document.msFullscreenElement ||
      document.body
    );
  },
  getPosition: function() {
    var me = this;
    if (me.position) {
      return me.position;
    }
    var bubbles = me.options.window.NotificationBubbles.slice(0, me.options.window.NotificationBubbles.length);
    var i = bubbles.indexOf(me);

    var last;

    do {
      i--;
      last = bubbles[i];
      if (last) {
        if (!me.position) {
          me.position = last.getPosition() + last.element.getSize().y + 30;
        }
        break;
      }

    } while (i > 0);
    if (!me.position) {
      me.position = 100;
    }
    return me.position;


  },
  drop: function(el) {

    var me = this;
    var drop = new Fx.Tween(el, {
      transition: Fx.Transitions.Expo.easeOut
    });
    drop.addEvent('onComplete', function() {


      me.options.window.setTimeout(function() {
        me.fadeout(el);
      }, 1000);

    });
    drop.start('top', me.getPosition());


  },
  fadeout: function(el) {
    var me = this;
    var fade = new Fx.Tween(el, {});
    fade.addEvent('onComplete', function() {
      me.options.window.NotificationBubbles.splice(me.options.window.NotificationBubbles.indexOf(me), 1);
      el.dispose();
    });
    fade.start('opacity', 0);

  }


});

NotificationBubble.Make = function(title, description, options) {
  if (window.parent && window.parent.NotificationBubble && window.parent.NotificationBubble !== NotificationBubble) {
    window.parent.NotificationBubble.Make(title, description, options);
  } else {
    var t = title.slice(0);
    var d = (description !== null ? description.slice(0) : null);
    var o = (options !== null ? Object.append({}, options) : null);

    new NotificationBubble(t, d, o);
  }
};