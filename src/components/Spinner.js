// src/components/Spinner.js

import React from 'react';
import { ClipLoader } from 'react-spinners';

const Spinner = () => (
  <ClipLoader size={50} color={'#2563EB'} loading={true} />
);

export default Spinner;
