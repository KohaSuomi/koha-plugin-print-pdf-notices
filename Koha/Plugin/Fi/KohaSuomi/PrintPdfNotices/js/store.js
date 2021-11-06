const store = new Vuex.Store({
  state: {
    results: [],
    errors: [],
    totalResults: 0,
    showLoader: false,
    notice: '',
    pdfTemp: '',
    messageId: null,
    libraryEmail: '',
    libraryName: '',
  },
  mutations: {
    addError(state, value) {
      state.errors.push(value);
    },
    removeErrors(state) {
      state.errors = [];
    },
    addResults(state, value) {
      state.results = value;
    },
    addTotalResults(state, value) {
      state.totalResults = value;
    },
    setNotice(state, value) {
      state.notice = '';
      state.notice += value;
    },
    setPDFTemp(state, value) {
      state.pdfTemp = value;
    },
    setMessageId(state, value) {
      state.messageId = value;
    },
    setLibraryEmail(state, value) {
      state.libraryEmail = value;
    },
    setLibraryName(state, value) {
      state.libraryName = value;
    },
    showLoader(state, value) {
      state.showLoader = value;
    },
  },
  actions: {
    fetchMessages({ commit, state }) {
      commit('removeErrors');
      commit('showLoader', true);
      var searchParams = new URLSearchParams();
      searchParams.append('status', 'pending');
      searchParams.append('message_transport_type', 'print');
      searchParams.append('letter_code', state.pdfTemp);
      searchParams.append('from_address', state.libraryEmail);

      axios
        .get('/api/v1/notices', {
          params: searchParams,
        })
        .then((response) => {
          commit('addResults', response.data);
          commit('showLoader', false);
        })
        .catch((error) => {
          commit('addError', error.response.data.error);
        });
    },
    editNotice({ commit, state }, status) {
      commit('showLoader', true);
      commit('removeErrors');
      axios
        .put('/api/v1/notices/' + state.messageId, { status: status })
        .then((response) => {
          commit('showLoader', false);
        })
        .catch((error) => {
          commit('addError', error.response.data.error);
        });
    },
  },
});

export default store;
