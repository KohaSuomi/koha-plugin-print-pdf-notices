import store from './store.js';

new Vue({
  el: '#viewApp',
  store: store,
  data() {
    return {
      showPDF: false,
      pagename: '',
      rules: {},
      pdftemp: '',
    };
  },
  mounted() {},
  computed: {
    results() {
      return store.state.results;
    },
    totalResults() {
      return store.state.totalResults;
    },
    errors() {
      return store.state.errors;
    },
    showLoader() {
      return store.state.showLoader;
    },
    notice() {
      return store.state.notice;
    },
  },
  methods: {
    showPage(val) {
      store.commit('setPDFTemp', val);
      if (val == 'ODUE1') {
        this.pagename = '1. muistutus';
        this.fetch();
      }
      if (val == 'ODUE2') {
        this.pagename = '2. muistutus';
        this.fetch();
      }
      if (val == 'HOLD') {
        this.pagename = 'Noutoilmoitukset';
        this.fetch();
      }
    },
    fetch() {
      store.dispatch('fetchMessages');
    },
    previewPDF(notice, message_id) {
      store.commit('setMessageId', message_id);
      store.commit('setNotice', notice);
      this.showPDF = true;
    },
    printMessagePDF(notice, message_id) {
      store.commit('setMessageId', message_id);
      store.commit('setNotice', notice);
      this.printPDF();
    },
    cancelNotice(message_id) {
      store.commit('setMessageId', message_id);
      store.dispatch('editNotice', 'failed');
      this.fetch();
    },
    printPDF() {
      store.dispatch('editNotice', 'sent');
      printJS({
        printable: 'printDoc',
        type: 'html',
        css: '/plugin/Koha/Plugin/Fi/KohaSuomi/OverdueTool/assets/css/pdf.css',
        documentTitle:
          store.state.pdfTemp + '_ilmoitus_' + store.state.messageId,
      });
      this.back();
      this.fetch();
    },
    back() {
      this.showPDF = false;
    },
  },
  filters: {
    moment: function (date) {
      return moment(date).locale('fi').format('DD.MM.YYYY HH:MM:SS');
    },
  },
});
