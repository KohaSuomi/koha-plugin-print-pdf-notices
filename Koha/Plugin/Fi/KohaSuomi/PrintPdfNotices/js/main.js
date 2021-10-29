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
  mounted() {
  },
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
      store.commit('setPDFTemp') = val;
      if (val == 'ODUE1') {
        this.pagename = '1. muistutus';
        this.fetch();
      }
      if (val == 'ODUE2') {
        this.pagename = '2. muistutus';
        this.fetch();
      }
      if (val == 'HOLDS') {
        this.pagename = 'Noutoilmoitukset';
        this.fetch();
      }
    },
    fetch() {
      store.dispatch('fetchMessages');
      this.activate();
    },
    messagePDF(notice, message_id) {
      store.commit('setMessageId', message_id);
      store.commit('setNotice', notice);
      this.showPDF = true;
    },
    printPDF() {
      store.dispatch('editNotice');
      printJS({
        printable: 'printDoc',
        type: 'html',
        css: '/plugin/Koha/Plugin/Fi/KohaSuomi/OverdueTool/css/pdf.css',
      });
    },
    back() {
      this.showPDF = false;
    }
  },
});
