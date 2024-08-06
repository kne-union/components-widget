const getApis = (options) => {
  const { prefix } = Object.assign({}, { prefix: '/api' }, options);
  return {
    getToken: {
      url: `${prefix}/getToken`, method: 'POST'
    }
  };
};

export default getApis;
