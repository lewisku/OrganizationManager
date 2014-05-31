var Member = require('../models/Member')
var Event = require('../models/Event')
var request = require('request');
var moment = require('moment');
var _ = require('underscore')
exports.getMembers = function(req, res) {
  Member.find(function(err, members) {
    res.render('member/list', {
      title: "Members",
      members: members
    })
  });
}

exports.getMember = function(req, res) {
  Member.findOne({"profile.mnum": req.params.id}, function(err, member) {
    if(member) {
      res.render('member/detail', {
        title: "Member information",
        member: member
      })
    }
    else {
      res.status(404);
      res.render('404');
    }
  });
}

exports.addEvent = function(req, res) {
  if(req.body.title && req.body.starttime && req.body.endtime) {
    Member.findOne({"profile.mnum": req.params.id}, function(err, member) {
      if(member) {
        member.events.push(new Event({
          title: req.body.title,
          starttime: new Date(req.body.starttime),
          endtime: new Date(req.body.endtime),
        }));
        member.save();
      }
    })
  }
  res.send(200);
}

exports.postMemberLookup = function(req, res) {
  if(req.query.isIso) {

  }
  else {
      console.log(req.params.mnum);
      var requestString = 'http://tribunal.uc.edu/drupal6/student/checkin/lookup?ucid=' + req.params.mnum
      console.log("request string is:" + requestString);
      request(requestString, function (error, response, body) {
          res.send(body);
      })
  }
}

exports.postMember = function(req, res) {

  var newMember = new Member({
    email: req.body.email,
    profile: {
      mnum: req.body.mnum,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      major: req.body.major
    }

  })
  newMember.save();
  res.redirect('/member');

}

exports.deleteMember = function(req, res) {
  console.log("deleting : " + req.params.id);
  var mnum = req.params.id;
  Member.remove({"profile.mnum": mnum}, function(err) {
    console.log(err);
  });
}

exports.getAddMember = function(req, res) {
  res.render('member/add', {
    title: "Add New Member"
  })
}
