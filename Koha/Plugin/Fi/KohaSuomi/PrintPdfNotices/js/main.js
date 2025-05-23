import store from './store.js';

const Multiselect = Vue.component(
  'vue-multiselect',
  window.VueMultiselect.default
);

new Vue({
  el: '#viewApp',
  store: store,
  components: {
    Multiselect
  },
  data() {
    return {
      showPDF: false,
      pagename: '',
      pdftemp: '',
      selectedLibraries: []
    };
  },
  mounted() {
    store.commit('setUserLibrary', jsondata.userlibrary);
    store.commit('setLibraryEmail', jsondata.libraryemail);
    store.commit('setLibraryName', jsondata.libraryname);
    store.commit('setPDFTemp', 'HOLD');
    this.selectedLibraries = JSON.parse(localStorage.getItem('printLibraries')) ? JSON.parse(localStorage.getItem('printLibraries')) : [];
    store.commit('addSelectedLibraries', this.selectedLibraries);
    this.pagename = 'Noutoilmoitukset';
    this.fetch();
    store.dispatch('fetchLibraries');
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
    libraryname() {
      return store.state.libraryName;
    },
    libraries() {
      return store.state.libraries;
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
    },
    selectLibraries() {
      localStorage.setItem(
        'printLibraries',
        JSON.stringify(this.selectedLibraries)
      );
      store.commit('addSelectedLibraries', this.selectedLibraries);
      this.fetch();
    },
    printPDF() {
      store.dispatch('editNotice', 'sent');
      printJS({
        printable: 'printDoc',
        type: 'html',
        css: '/plugin/Koha/Plugin/Fi/KohaSuomi/PrintPdfNotices/css/pdf.css',
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
