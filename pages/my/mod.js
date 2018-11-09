// pages/my/mod.js
var app = getApp();
var dateFtt = require('../utils/dateUtils.js');
Page({

  /**
   * 页面的初始数据
   */
	data: {
		voteid: '',
		votetype: 1,
		title: '',
		describe: '',
		selections: [],
		date: '',
		time: '',
		noname: false
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
				this.data.voteid = votes[i].voteId;
				this.data.votetype = votes[i].voteType;
				this.data.title = votes[i].voteTitle;
				this.data.describe = votes[i].voteDescribe;
				this.data.selections = votes[i].voteSelection;
				var dueDate = votes[i].voteDueDate;
				this.data.date = dueDate.substring(0, 10);
				this.data.time = dueDate.substring(11, 16);
				this.data.noname = votes[i].voteNoName;

				this.setData({
					voteid: this.data.voteid,
					title: this.data.title,
					describe: this.data.describe,
					selections: this.data.selections,
					date: this.data.date,
					time: this.data.time,
					noname: this.data.noname
				});
				break;
			}
		}
	},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function () {

	},

  /**
   * 生命周期函数--监听页面显示
   */
	onShow: function () {

	},

  /**
   * 生命周期函数--监听页面隐藏
   */
	onHide: function () {

	},

  /**
   * 生命周期函数--监听页面卸载
   */
	onUnload: function () {

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

	changeSelectionName: function (e) {
		console.log("change selection name");
		var unique = e.target.dataset.unique;
		// console.log("unique: "+ unique);

		for (var i = 0; i < this.data.selections.length; i++) {
			var selection = this.data.selections[i];
			if (selection.unique == unique) {
				this.data.selections[i].value = e.detail.value;
				this.setData({
					selections: this.data.selections
				});
				break;
			}
		}
	},

	bindDateChange: function (e) {
		console.log("change due date");
		this.data.date = e.detail.value;
		this.setData({
			date: this.data.date
		});
	},

	bindTimeChange: function (e) {
		console.log("change deadline time");
		this.data.time = e.detail.value;
		this.setData({
			time: this.data.time
		});
	},

	deleteSelection: function (e) {
		console.log("delete selection");
		// console.log(JSON.stringify(e));
		var unique = e.target.dataset.unique;
		// console.log("unique:"+unique);

		var index = -1;
		for (var i = 0; i < this.data.selections.length; i++) {
			var selection = this.data.selections[i];
			if (selection.unique == unique) {
				index = i;
				break;
			}
		}

		if (index >= 0) {
			this.data.selections.splice(index, 1);
			// console.log(this.data.selections);
			this.setData({
				selections: this.data.selections
			});
		}
	},

	addSelection: function (e) {
		console.log("add selection");
		const length = this.data.selections.length;

		var uniqueNext = length == 0 ? 1 :
			this.data.selections[length - 1].unique + 1;

		this.data.selections = this.data.selections.concat([{
			name: 'selection_' + uniqueNext,
			value: '',
			voter: [],
			unique: uniqueNext
		}]);

		// console.log(this.data.selections);

		this.setData({
			selections: this.data.selections
		});
	},

	formSubmit: function (e) {
		console.log("form submit");

		var datas = e.detail.value;
		if (datas.title == null || datas.title.length <= 0) {
			wx.showModal({
				title: '内容有误',
				content: '题目不能为空',
				confirmText: '确定',
				showCancel: false
			});
			return false;
		}

		if (this.data.selections == null || this.data.selections.length <= 0) {
			wx.showModal({
				title: '内容有误',
				content: '最少要有一个选项',
				confirmText: '确定',
				showCancel: false
			});
			return false;
		}

		for (var i = 0; i < this.data.selections.length; i++) {
			var selection = this.data.selections[i];
			if (selection.value == null || selection.value.length <= 0) {
				wx.showModal({
					title: '内容有误',
					content: '第' + (i + 1) + '个选项内容不能为空',
					confirmText: '确定',
					showCancel: false
				});
				return false;
			}
		}

		var votes = wx.getStorageSync("votes");
		for (var vote of votes) {
			if (vote.voteId == this.data.voteid) {
				vote.voteTitle = datas.title;
				vote.voteDescribe = datas.describe;
				vote.voteSelection = this.data.selections;
				vote.voteDueDate = this.data.date + " " + this.data.time;
				vote.voteNoName = datas.noname;
				break;
			}
		}
		app.globleData.votes = votes;
		wx.setStorageSync("votes", votes);

		wx.redirectTo({
			url: '/pages/my/detail?voteid=' + this.data.voteid
		})
	}
})