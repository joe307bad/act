import { BaseModel } from '@act/data/core';
import React, { PropsWithChildren, ReactElement } from 'react';
import { Tabs, TabScreen } from 'react-native-paper-tabs';
import { Option } from './Selector';

export type TabbedSelectorProps<T, C> = {
  data: [string, T[]][];
  categories: C[];
  optionTitleProperty: string;
  optionSubtitleProperty?: string;
};

export type Category = { name: string } & BaseModel;
export const TabbedSelector: <
  T extends BaseModel,
  C extends Category
>(
  p: PropsWithChildren<TabbedSelectorProps<T, C>>
) => ReactElement = ({
  data,
  categories,
  optionTitleProperty,
  optionSubtitleProperty
}) => {
  return (
    <Tabs>
      {data.map((category) => {
        const label = (() => {
          if (category[0] === 'null') {
            return 'No Category';
          }

          if (category[0] === 'All') {
            return 'All';
          }

          return categories.find((c) => c.id === category[0]).name;
        })();
        return (
          <TabScreen key={category[0]} label={label}>
            <>
              {category[1].map((d) => (
                <Option
                  initialValue={false}
                  onChange={() => {}}
                  title={d[optionTitleProperty]}
                  value={d.id}
                  key={d.id}
                />
              ))}
            </>
          </TabScreen>
        );
      })}
    </Tabs>
  );
};
