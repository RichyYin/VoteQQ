// pages/new/add.js
var app = getApp();
var dateFtt = require('../utils/dateUtils.js');
Page({

  /**
   * 页面的初始数据
   */
	data: {
		//voteId: app.globleData.voteId + 1,
		voteid: wx.getStorageSync("voteid"),
		vatetype: 0,
		date: dateFtt("yyyy-MM-dd", new Date()),
		time: dateFtt("hh:mm", new Date()),
		selections: [
			{
				name: 'selection_1',
				value: '',
				voter: [],
				unique: 1
			},
			{
				name: 'selection_2',
				value: '',
				voter: [],
				unique: 2
			}
		]
	},

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		this.data.voteid = wx.getStorageSync("voteid");
		this.data.votetype = options.votetype;
		this.setData({
			voteid: this.data.voteid,
			votetype: this.data.votetype
		});
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

		var newVote = {
			voteId: datas.id,
			voteType: this.data.votetype,
			voteTitle: datas.title,
			voteDescribe: datas.describe,
			voteSelection: this.data.selections,
			voteDueDate: this.data.date + " " + this.data.time,
			voteNoName: datas.noname
		};

		var votes = wx.getStorageSync("votes");
		if (votes == null || votes.length <= 0) {
			votes = [newVote];
		} else {
			votes = votes.concat([newVote]);
		}
		app.globleData.votes = votes;
		app.globleData.voteId = datas.id++;
		wx.setStorageSync("votes", votes);
		wx.setStorageSync("voteid", datas.id++);

		wx.redirectTo({
			url: '/pages/my/detail?voteid=' + newVote.voteId
		})
	}
})