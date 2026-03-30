/**
 * Локальное хранилище объявлений (черновик + опубликованные) в localStorage.
 * Ключи зафиксированы для совместимости с уже сохранёнными данными.
 */
(function (global) {
  "use strict";

  var KEYS = {
    DRAFT: "ozon_adv_create_ad_draft_v1",
    PUBLISHED: "ozon_adv_published_listings_v1",
  };

  function safeParse(raw, fallback) {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  var AdStorage = {
    /** Константы ключей localStorage */
    KEYS: KEYS,

    /** Сырая строка черновика или null */
    getDraftRaw: function () {
      try {
        return global.localStorage.getItem(KEYS.DRAFT);
      } catch (e) {
        return null;
      }
    },

    /** Сохранить JSON-строку черновика */
    setDraftRaw: function (jsonString) {
      try {
        global.localStorage.setItem(KEYS.DRAFT, jsonString);
        return true;
      } catch (e) {
        return false;
      }
    },

    /** Удалить черновик */
    removeDraft: function () {
      try {
        global.localStorage.removeItem(KEYS.DRAFT);
        return true;
      } catch (e) {
        return false;
      }
    },

    /** Массив опубликованных объявлений (копия) */
    getPublishedList: function () {
      try {
        var raw = global.localStorage.getItem(KEYS.PUBLISHED);
        var p = safeParse(raw, []);
        return Array.isArray(p) ? p.slice() : [];
      } catch (e) {
        return [];
      }
    },

    /** Заменить весь список опубликованных */
    setPublishedList: function (list) {
      if (!Array.isArray(list)) return false;
      try {
        global.localStorage.setItem(KEYS.PUBLISHED, JSON.stringify(list));
        return true;
      } catch (e) {
        return false;
      }
    },

    /** Добавить объявление в начало списка */
    prependPublished: function (entry) {
      var list = this.getPublishedList();
      list.unshift(entry);
      return this.setPublishedList(list);
    },
  };

  global.OzonAdvAdStorage = AdStorage;
})(typeof window !== "undefined" ? window : globalThis);
