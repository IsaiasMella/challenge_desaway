import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_KEY = '@lastPdfUri';

export async function getLastSavedPdfUri(): Promise<string | null> {
  return AsyncStorage.getItem(LAST_KEY);
}
