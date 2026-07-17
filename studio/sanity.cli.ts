import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'ptkp2bg1',
    dataset: 'production',
  },
  deployment: {
    appId: 'lfyddiwrilb0jqgyvynii5ft',
    autoUpdates: true,
  },
})
