import React from 'react';
import { make as App } from '../../lib/es6/re/Index.bs';
import 'reflect-metadata';
import db from '@act/data/rn';

export default () => {
  const achievements = db.useCollection('achievements');
  return <App sync={db.sync} allPosts={achievements} />;
};
