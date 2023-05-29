import React from 'react';
import { useState } from 'react';
import db from '@act/data/web';
import { AchievementCategory } from '@act/data/core';
import {FormControl, InputLabel, NativeSelect} from "@mui/material";


type CategoryFilterSelection =
  | 'ALL_CATEGORIES'
  | 'NO_CATEGORY'
  | number;

export const CategoryFilter = (props) => {
  const { item, applyValue } = props;
  const [v, setValue] = useState<CategoryFilterSelection>(
    item.value ?? 'ALL_CATEGORIES'
  );

  const handleFilterChange = (event) => {
    const cat = event.target.value;
    setValue(cat);
    applyValue({ ...item, value: cat });
  };

  const achievementCategories = db.useCollection<AchievementCategory>(
    'achievement_categories',
    ['name']
  );

  return (
    <FormControl>
      <InputLabel id="demo-simple-select-label">
        Category
      </InputLabel>
      <NativeSelect value={v} onChange={handleFilterChange}>
        <option key={'ALL_CATEGORIES'} value={'ALL_CATEGORIES'}>
          All Categories
        </option>
        <option key={'NO_CATEGORY'} value={'NO_CATEGORY'}>
          No Category
        </option>
        {achievementCategories.map((ac, i) => (
          <option key={i + 1} value={ac.id}>
            {ac.name}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
};

export const categoryOperators = [
  {
    label: 'Is',
    value: 'is',
    getApplyFilterFn: (filterItem) => {
      if (
        !filterItem.columnField ||
        !filterItem.value ||
        !filterItem.operatorValue
      ) {
        return null;
      }

      return (params) => {
        switch (filterItem.value as CategoryFilterSelection) {
          case 'ALL_CATEGORIES':
            return true;
          case 'NO_CATEGORY':
            return !params.row.category_id;
          default:
            return params.row.category_id === filterItem.value;
        }
      };
    },
    InputComponent: CategoryFilter,
    InputComponentProps: { type: 'string' }
  }
];
