const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

const sleep = async (time) => {
  await snooze(time);
};

module.exports = {
  sleep
};
