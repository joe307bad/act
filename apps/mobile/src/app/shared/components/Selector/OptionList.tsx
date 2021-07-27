import { BaseModel } from '@act/data/core';
import { snakeCase } from 'change-case';
import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState
} from 'react';
import { Surface } from 'react-native-paper';
import { SelectedOption } from '.';
import { Option } from './Option';

type OptionListProps<T extends BaseModel> = {
  data: T[];
  onChange: (selected: Map<string, SelectedOption>) => void;
  initialSelected: Map<string, SelectedOption>;
  optionTitleProperty: keyof T;
  optionSubtitleProperty?: keyof T;
  selectable?: boolean;
  showCountDropdown?: boolean;
};
export const OptionList: <T extends BaseModel>(
  p: PropsWithChildren<OptionListProps<T>>
) => ReactElement = ({
  data,
  onChange,
  initialSelected,
  optionSubtitleProperty,
  optionTitleProperty,
  selectable = true,
  showCountDropdown = false
}) => {
  const [selected, setSelected] =
    useState<Map<string, SelectedOption>>(initialSelected);

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  return (
    <Surface style={{ elevation: 2 }}>
      {data.map((d) => (
        <Option
          disableSelection={!selectable}
          key={d.id}
          value={d.id}
          title={d[snakeCase(optionTitleProperty as string)]}
          subtitle={d[snakeCase(optionSubtitleProperty as string)]}
          initialValue={initialSelected.has(d.id)}
          showCountDropdown={showCountDropdown}
          onChange={(v) =>
            setSelected((p) => {
              const newSelected = new Map(p);
              const exists = newSelected.has(d.id);
              if (exists) {
                newSelected.delete(d.id);
                return newSelected;
              }
              newSelected.set(d.id, {
                id: d.id,
                display: d[snakeCase(optionTitleProperty as string)],
                categoryId: d.category_id,
                points: d.points
              });
              return newSelected;
            })
          }
        />
      ))}
    </Surface>
  );
};
