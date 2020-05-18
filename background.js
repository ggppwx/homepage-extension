// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const showNotification = (data) => {
  chrome.notifications.create("alarm", data.opt, function(notificationId) {});
};

const switchToTab = (data) => {
    chrome.tabs.update(data.tabId, {highlighted: true})
};

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });
});


chrome.runtime.onMessage.addListener(data => {  
    console.log('ah oh');
    console.log(data);
    if (data.type == "notification") {
        showNotification(data);
        switchToTab(data);
    }

});