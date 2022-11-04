import {Dimensions, Platform, PixelRatio} from 'react-native';
const {height, width, fontScale} = Dimensions.get('window');
// based on iphone 5s's scale
const scale = width / 320;
export const responsiveHeight = h => {
  return PixelRatio.roundToNearestPixel(height * (h / 100));
};
export const responsiveWidth = w => {
  return PixelRatio.roundToNearestPixel(width * (w / 100));
};
export function responsiveFonts(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}