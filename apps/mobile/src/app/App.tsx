import React from 'react';
import { make as App } from '../../re/Index.bs';
import 'reflect-metadata';
import db from '@act/data/rn';

export default () => {
  const achievements = db.useCollection('achievements');
  return <App sync={db.sync} allPosts={achievements} />;
};
