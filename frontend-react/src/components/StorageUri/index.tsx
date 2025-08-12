import React from 'react';
import { Typography } from 'antd';
import { PredictorExtension } from '../../types';

const { Link } = Typography;

interface StorageUriProps {
  namespace: string;
  predictor: PredictorExtension;
}

const isPVC = (uri: string | undefined): boolean => {
  return uri?.slice(0, 6) === 'pvc://';
};

const getPVCUrl = (uri: string, ns: string): string => {
  const splitUrls = uri.split('/');
  const pvcName = splitUrls[2];
  return `/volumes/volume/details/${ns}/${pvcName}`;
};

const StorageUri: React.FC<StorageUriProps> = ({ namespace, predictor }) => {
  const storageUri = predictor?.storageUri;

  if (!storageUri) {
    return null;
  }

  return isPVC(storageUri) ? (
    <Link href={getPVCUrl(storageUri, namespace)}>{storageUri}</Link>
  ) : (
    <span>{storageUri}</span>
  );
};

export default StorageUri;
