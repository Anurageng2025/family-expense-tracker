import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.expansisTrack.app',
  appName: 'Expansis Track',
  webDir: 'out',
  server: {
    androidScheme: 'http'
  }
};

export default config;
