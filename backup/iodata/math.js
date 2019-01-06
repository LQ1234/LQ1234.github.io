(function() {

  var MPL = {
    //midpoint
    midpt:function(a,b){
      return(new MPL.P((a.x+b.x)/2,(a.y+b.y)/2))
    },
    //true Modulo
    mod: function(n, m) {
      return ((n % m) + m) % m;
    },
    //translate a by b
    add: function(a, b) {
      a.x += b.x, a.y += b.y
    },
    //(angle,distance) to (x,y)
    AStP: function(a, b) {
      return ({
        x: Math.cos(a) * b,
        y: Math.sin(a) * b
      });
    },
    //point defination
    P: function(x, y) {
      if (x) {
        this.x = x;
      } else {
        this.x = 0;
      }
      if (y) {
        this.y = y;
      } else {
        this.y = 0;
      }
    },
    //distance between points
    dist: function(a, b) {
      return (Math.hypot(a.x - b.x, a.y - b.y))
    },
    //force the distance from p to (0,0) to be d
    setD: function(p, d) {
      if (p.x === 0 && p.y === 0) return (new MPL.P());
      var m = Math.atan2(p.y, p.x);
      return (new this.P(Math.cos(m) * d, Math.sin(m) * d));

    },
    //rotate points p around l a degrees
    rotOn: function(p, l, a) {
      if (p instanceof Array) {
        var ret = [];
        for (var i = 0; i < p.length; i++) {
          ret[i] = MPL.rotOn(p[i], l, a);
        }
        return (ret);
      } else {
        var d = this.dist(p, l);
        var m = Math.atan2(p.y - l.y, p.x - l.x);
        m += a;
        return (new this.P(Math.cos(m) * d + l.x, Math.sin(m) * d + l.y));
      }
    },
    intersecting: function(...args) {
      for (var i = 0; i < args.length; i += 4) {
        if (!(
            (Math.min(args[i], args[i + 1]) <= args[i + 2] && args[i + 2] <= Math.max(args[i], args[i + 1])) ||
            (Math.min(args[i], args[i + 1]) <= args[i + 3] && args[i + 3] <= Math.max(args[i], args[i + 1])) ||
            (Math.min(args[i + 2], args[i + 3]) <= args[i] && args[i] <= Math.max(args[i + 2], args[i + 3])) ||
            (Math.min(args[i + 2], args[i + 3]) <= args[i + 1] && args[i + 1] <= Math.max(args[i + 2], args[i + 3]))
          )) {
          return false;
        }
      }
      return true;
    },
    Rect: function(p1, p2, rot, rotp) {
      this.p1 = p1;
      this.p2 = p2;
      this.rot = rot ? rot : 0;

      this.rotp = rotp ? rotp : new MPL.P();
      this.test_desplay = function(ctx) {
        ctx.save();
        ctx.translate(this.rotp.x, this.rotp.y);
        ctx.rotate(this.rot);
        ctx.fillRect(this.p1.x - this.rotp.x, this.p1.y - this.rotp.y, this.p2.x - this.p1.x, this.p2.y - this.p1.y)
        ctx.restore();
      }
      //length of diagonal
      Object.defineProperty(this, 'dia', {
        get: function() {
          return (MPL.dist(this.p1, this.p2));
        }
      });
      //get points
      Object.defineProperty(this, 'points', {
        get: function() {
          var ret = [
            MPL.rotOn(new MPL.P(this.p1.x, this.p1.y), this.rotp, this.rot),
            MPL.rotOn(new MPL.P(this.p2.x, this.p2.y), this.rotp, this.rot),
            MPL.rotOn(new MPL.P(this.p1.x, this.p2.y), this.rotp, this.rot),
            MPL.rotOn(new MPL.P(this.p2.x, this.p1.y), this.rotp, this.rot)
          ];
          return (ret);
        }
      });

      this.touching = function(other) {
        var p1 = new MPL.P((this.p1.x + this.p2.x) / 2, (this.p1.y + this.p2.y) / 2);
        p1 = MPL.rotOn(p1, this.rotp, this.rot);
        var p2 = new MPL.P((other.p1.x + other.p2.x) / 2, (other.p1.y + other.p2.y) / 2);
        p2 = MPL.rotOn(p2, other.rotp, other.rot);
        if (2 * MPL.dist(p1, p2) > this.dia + other.dia)
          return false;

        function textAxes(n, t, o) { //true if touching
          var a = MPL.rotOn(t.points, new MPL.P(), -n);
          var b = MPL.rotOn(o.points, new MPL.P(), -n);
          if (!MPL.intersecting(Math.min(a[0].x, a[1].x, a[2].x, a[3].x), Math.max(a[0].x, a[1].x, a[2].x, a[3].x), Math.min(b[0].x, b[1].x, b[2].x, b[3].x), Math.max(b[0].x, b[1].x, b[2].x, b[3].x))) return false;
          if (!MPL.intersecting(Math.min(a[0].y, a[1].y, a[2].y, a[3].y), Math.max(a[0].y, a[1].y, a[2].y, a[3].y), Math.min(b[0].y, b[1].y, b[2].y, b[3].y), Math.max(b[0].y, b[1].y, b[2].y, b[3].y))) return false;
          return (true);
        }
        if (!textAxes(this.rot, this, other)) return false;
        if (!textAxes(other.rot, this, other)) return false;
        return true;
      };
      //detect if point in rectangle
      this.pin = function(point) {
        var nj = MPL.rotOn(point, this.rotp, -this.rot);

        return (
          Math.min(this.p1.x, this.p2.x) < nj.x && nj.x < Math.max(this.p1.x, this.p2.x) &&
          Math.min(this.p1.y, this.p2.y) < nj.y && nj.y < Math.max(this.p1.y, this.p2.y)
        )
      }
      this.getEdgeAngles = function(other) {
        var angles = [];
        var dopt = function(rect, point) {
          var n = MPL.rotOn(point, rect.rotp, -rect.rot);
          n.x -= (rect.p1.x + rect.p2.x) / 2;
          n.y -= (rect.p1.y + rect.p2.y) / 2;
          n.x = Math.abs(n.x)
          n.y = Math.abs(n.y)
          if (n.y / n.x > Math.abs((rect.p1.y - rect.p2.y) / (rect.p1.x - rect.p2.x))) {

            angles.push(rect.rot)

          } else {
            angles.push(rect.rot + Math.PI / 2)

          }
        }
        var rectpoints = this.points;
        for (var i = 0; i < rectpoints.length; i++) {
          if (other.pin(rectpoints[i])) {
            dopt(other, rectpoints[i])
          }
          /*var nw=MPL.midpt(rectpoints[i],rectpoints[(i+1)%4]);
          if (other.pin(nw)) {
            dopt(other, nw)
          }*/
        }
        var rectpoints = other.points;
        for (var i = 0; i < rectpoints.length; i++) {
          if (this.pin(rectpoints[i])) {
            dopt(this, rectpoints[i])
          }
          /*var nw=MPL.midpt(rectpoints[i],rectpoints[(i+1)%4]);
          if (this.pin(nw)) {
            dopt(this, nw)
          }*/
        }
        return angles;
      }
    },
    rand: function(a, b) {
      return Math.random() * (b - a) + a;
    }
  };
  if (typeof module !== 'undefined') {
    module.exports = MPL;
  } else {
    window.MPL = MPL;
  }
})();
