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
    userLibrary: '',
    libraries: [],
    selectedLibraries: []
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
    addLibraries(state, value) {
      state.libraries = value;
    },
    addSelectedLibraries(state, value) {
      state.selectedLibraries = value;
    },
    pushResults(state, value) {
      state.results.push(value);
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
    setUserLibrary(state, value) {
      state.userLibrary = value;
    },
    showLoader(state, value) {
      state.showLoader = value;
    },
  },
  actions: {
    fetchMessages({ dispatch, commit, state }) {
      commit('removeErrors');
      commit('showLoader', true);
      commit('addResults', []);
      var searchParams = new URLSearchParams();
      searchParams.append('status', 'pending');
      searchParams.append('message_transport_type', 'print');
      searchParams.append('letter_code', state.pdfTemp);

      axios
        .get('/api/v1/contrib/kohasuomi/notices', {
          params: searchParams,
        })
        .then((response) => {
          dispatch('getPatrons', response.data);
        })
        .catch((error) => {
          commit('showLoader', false);
          commit('addError', error.response.data.error);
        });
    },
    fetchLibraries({ commit, state }) {
      commit('removeErrors');
      commit('showLoader', true);
      commit('addLibraries', []);
      var searchParams = new URLSearchParams();
      searchParams.append('_per_page', -1);

      axios
        .get('/api/v1/libraries', {
          params: searchParams,
        })
        .then((response) => {
          commit('addLibraries', response.data);
        })
        .catch((error) => {
          commit('showLoader', false);
          commit('addError', error.response.data.error);
        });
    },
    async getPatrons({ commit, state }, payload) {
      const promises = [];
      payload.forEach((element) => {
        promises.push(
          axios
            .get('/api/v1/patrons/' + element.borrowernumber)
            .then((response) => {
              if (state.selectedLibraries.find(o => o.library_id === response.data.library_id)) {
                element.librarycode = response.data.library_id;
                commit('pushResults', element);
              } else if (state.selectedLibraries.length === 0) {
                element.librarycode = response.data.library_id;
                commit('pushResults', element);
              }
            })
            .catch((error) => {
              commit('addError', error.response.data.error);
            })
        );
      });
      await Promise.all(promises).then(() => {
        commit('showLoader', false);
      });
    },
    editNotice({ commit, state }, status) {
      commit('showLoader', true);
      commit('removeErrors');
      axios
        .put('/api/v1/contrib/kohasuomi/notices/' + state.messageId, { status: status })
        .then(() => {
          commit('showLoader', false);
          this.dispatch('fetchMessages');
        })
        .catch((error) => {
          commit('showLoader', false);
          commit('addError', error.response.data.error);
        });
    },
  },
});

export default store;
