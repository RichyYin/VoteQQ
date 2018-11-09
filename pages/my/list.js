// pages/my/list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
		votes: [],
		showToolbar: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		console.log("onLoad");
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
		// var votes = app.globleData.votes;
		var votes = wx.getStorageSync("votes");
		if (votes == null || votes.length <= 0) {
			return;
		}
		for (var i = 0; i < votes.length; i++) {
			// console.log(JSON.stringify(votes[i]));
		}
		this.data.votes = votes;
		this.setData({
			votes: this.data.votes
		});
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

	tapList: function (e) {
		console.log("tap vote list");
		if (this.data.showToolbar == e.target.dataset.voteid) {
			this.data.showToolbar = '';
		} else {
			this.data.showToolbar = e.target.dataset.voteid;
		}
		this.setData({
			showToolbar: this.data.showToolbar
		});
	},

	viewVote: function (e) {
		console.log("view the vote");
		this.data.showToolbar = '';
		this.setData({
			showToolbar: this.data.showToolbar
		});
		wx.navigateTo({
			url: '/pages/my/detail?voteid=' + e.target.dataset.voteid
		})
	},

	modifyVote: function (e) {
		console.log("modify the vote");
		this.data.showToolbar = '';
		this.setData({
			showToolbar: this.data.showToolbar
		});
		wx.navigateTo({
			url: '/pages/my/mod?voteid=' + e.target.dataset.voteid
		})
	},

	deleteVote: function (e) {
		console.log("delete the vote");
		var voteId = e.target.dataset.voteid;
		var votes = wx.getStorageSync("votes");
		for (var i = 0; i < votes.length; i++) {
			if (voteId = votes[i].voteId) {
				votes.splice(i, 1);
				wx.setStorageSync("votes", votes);
				this.setData({
					votes: votes
				})
				break;
			}
		}
		this.data.showToolbar = '';
		this.setData({
			showToolbar: this.data.showToolbar
		});
	}

})