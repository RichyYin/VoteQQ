// pages/my/detail.js
var app = getApp();
var concatDistinct = require('../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		vote: {
			voteId: '',
			voteType: 0,
			voteTitle: '',
			voteDescribe: '',
			voteSelection: [],
			voteDueDate: '',
			voteNoName: false
		},
		voters: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		console.log("onLoad, voteid: " + options.voteid);
		// var votes = app.globleData.votes;
		var votes = wx.getStorageSync("votes");
		if (votes == null || votes.length <= 0) {
			return;
		}
		for (var i = 0; i < votes.length; i++) {
			if (votes[i].voteId == options.voteid) {
				this.data.vote = {
					voteId: votes[i].voteId,
					voteType: votes[i].voteType,
					voteTitle: votes[i].voteTitle,
					voteDescribe: votes[i].voteDescribe,
					voteSelection: votes[i].voteSelection,
					voteDueDate: votes[i].voteDueDate,
					voteNoName: votes[i].voteNoName
				};
				for (var j = 0; j < votes[i].voteSelection.length; j++) {
					this.data.voters = concatDistinct(this.data.voters, votes[i].voteSelection[j].voter);
				}
				this.setData({
					vote: this.data.vote,
					voters: this.data.voters
				});
				break;
			}
		}
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
		console.log("onReady");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
		console.log("onShow");
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
		console.log("onHide");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
		console.log("onUnload");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
		console.log("share the vote");
		return {
			title: this.data.vote.voteTitle,
			path: '/pages/my/detail?voteid='
		}
  },

	switchVote: function (e) {
		console.log("switch vote");
		var date = new Date();
		var deadline = new Date(this.data.vote.voteDueDate);
		if (date.getTime() >= deadline.getTime()) {
			wx.showModal({
				title: '温馨提示',
				content: '该投票截止时间已到',
				confirmText: '确定',
				showCancel: false
			});
			return false;
		}
		var unique = e.currentTarget.dataset.unique;
		// console.info(unique);
		var selection = this.data.vote.voteSelection;
		for (var i = 0; i < selection.length; i++) {
			if (selection[i].unique == unique) {
				if (this.data.vote.voteType == 1) {
					selection[i].voter = ["yinyiqi"];
				} else if (this.data.vote.voteType == 2) {
					if (selection[i].voter.indexOf("yinyiqi") >= 0) {
						selection[i].voter = [];
					} else {
						selection[i].voter = ["yinyiqi"];
					}
				}
			} else if (this.data.vote.voteType == 1) {
				selection[i].voter = [];
			}
			this.data.voters = concatDistinct(this.data.voters, selection[i].voter);
		}
		this.setData({
			vote: this.data.vote,
			voters: this.data.voters
		})
		var votes = wx.getStorageSync("votes");
		for (var i = 0; i < votes.length; i++) {
			if (votes[i].voteId == this.data.vote.voteId) {
				votes[i] = this.data.vote;
				break;
			}
		}
		wx.setStorageSync("votes", votes);
	}
})