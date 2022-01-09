// !! https://github.com/nassor/mongoose-history/blob/master/lib/mongoose-history.js
"use strict";
const mongoose = require("mongoose");
const hm = require("./history-model");
const async = require("async");

module.exports = function historyPlugin(schema, options) {
  const customCollectionName = options && options.customCollectionName;
  const customDiffAlgo = options && options.customDiffAlgo;
  const diffOnly = options && options.diffOnly;
  const metadata = options && options.metadata;

  // Clear all history collection from Schema
  schema.statics.historyModel = function () {
    return hm.HistoryModel(
      hm.historyCollectionName(this.collection.name, customCollectionName),
      options
    );
  };

  // Clear all history documents from history collection
  schema.statics.clearHistory = function (callback) {
    const History = hm.HistoryModel(
      hm.historyCollectionName(this.collection.name, customCollectionName),
      options
    );
    History.remove({}, function (err) {
      callback(err);
    });
  };

  // Save original data
  schema.post("init", function () {
    if (diffOnly) {
      this._original = this.toObject();
    }
  });

  function setMetadata(original, d, historyDoc, callback) {
    async.each(
      metadata,
      (m, cb) => {
        if (typeof m.value === "function") {
          if (m.value.length === 3) {
            /** async function */
            m.value(original, d, function (err, data) {
              if (err) cb(err);
              historyDoc[m.key] = data;
              cb();
            });
          } else {
            historyDoc[m.key] = m.value(original, d);
            cb();
          }
        } else {
          historyDoc[m.key] = d ? d[m.value] : null;
          cb();
        }
      },
      callback
    );
  }

  // Create a copy when insert or update, or a diff log
  schema.post("save", function (next) {
    let historyDoc = {};

    if (diffOnly && !this.isNew) {
      var original = this._original;
      delete this._original;
      var d = this.toObject();
      var diff = {};
      diff["_id"] = d["_id"];
      for (var k in d) {
        if (customDiffAlgo) {
          var customDiff = customDiffAlgo(k, d[k], original[k]);
          if (customDiff) {
            diff[k] = customDiff.diff;
          }
        } else {
          if (String(d[k]) != String(original[k])) {
            diff[k] = d[k];
          }
        }
      }

      historyDoc = createHistoryDoc(diff, "u");
    } else {
      var d = this.toObject();
      let operation = this.isNew ? "i" : "u";
      historyDoc = createHistoryDoc(d, operation);
    }

    saveHistoryModel(original, d, historyDoc, this.collection.name, next);
  });

  // Listen on update
  schema.post("update", function (next) {
    processUpdate.call(this, next);
    return;

  });

  // Listen on updateOne
  schema.post("updateOne", function (next) {
    processUpdate.call(this, next);
    return;

  });

  // Listen on findOneAndUpdate
  schema.post("findOneAndUpdate", function (next) {
    processUpdate.call(this, next);
    return;
  });

  // Create a copy on remove
  schema.post("remove", function (next) {
    let d = this.toObject();
    let historyDoc = createHistoryDoc(d, "r");

    saveHistoryModel(
      this.toObject(),
      d,
      historyDoc,
      this.collection.name,
      next
    );
  });

  // Create a copy on findOneAndRemove
  schema.post("findOneAndRemove", function (doc, next) {
    processRemove.call(this, doc, next);
  });

  function createHistoryDoc(d, operation) {
    const { __v, ...doc } = d;

    let historyDoc = {};
    let date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);

    if (date.getMinutes() >= 30) date.setMinutes(30);
    else date.setMinutes(0);
    historyDoc["t"] = date;
    historyDoc["o"] = operation;
    historyDoc["d"] = doc;

    return historyDoc;
  }

  function saveHistoryModel(original, d, historyDoc, collectionName, next) {
    if (metadata) {
      setMetadata(original, d, historyDoc, (err) => {
        if (err) return next(err);
        let history = new hm.HistoryModel(
          hm.historyCollectionName(collectionName, customCollectionName),
          options
        )(historyDoc);
        history.save(next);
      });
    } else {
      let history = new hm.HistoryModel(
        hm.historyCollectionName(collectionName, customCollectionName),
        options
      )(historyDoc);
      history.save(next);
    }
  }

  function processUpdate(next) {
    let d = this._update.$set || this._update;
    let historyDoc = createHistoryDoc(d, "u");
    hm.HistoryModel(
      hm.historyCollectionName(
        this.mongooseCollection.collectionName,
        customCollectionName
      ),
      options
    )
      .findOne({ t: historyDoc.t, adID: historyDoc.d.adID })
      .then((doc) => {
       console.log(doc);
     //   console.log(historyDoc);
        if (doc) {
          hm.HistoryModel(
            hm.historyCollectionName(
              this.mongooseCollection.collectionName,
              customCollectionName
            ),
            options
          )
            .findOneAndUpdate(
              { t: historyDoc.t, adID: historyDoc.d.adID },
              {
                $set: {
                  t: historyDoc.t,
                  adID: historyDoc.d.adID,
                  d: {
                    views: historyDoc.d.views || doc.d.views || 0,
                    clicks: historyDoc.d.clicks || doc.d.clicks || 0,
                    skips: historyDoc.d.skips || doc.d.skips || 0,
                    adID: historyDoc.d.adID || doc.d.adID,
                  }
                }
              },
              { new: true },
            )
            .then((doc) => {
             // console.log("33", doc);
            });
        } else {
          saveHistoryModel(
            this.toObject,
            d,
            historyDoc,
            this.mongooseCollection.collectionName,
            next
          );
        }
      });
  }

  function processRemove(doc, next) {
    let d = doc.toObject();
    let historyDoc = createHistoryDoc(d, "r");

    saveHistoryModel(
      this.toObject,
      d,
      historyDoc,
      this.mongooseCollection.collectionName,
      next
    );
  }
};
