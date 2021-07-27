import React, {
  FC,
  useState,
  PropsWithChildren,
  ReactElement,
  useEffect
} from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  Avatar,
  Card,
  Checkbox,
  List,
  Surface,
  useTheme
} from 'react-native-paper';
import { AwesomeButtonMedium } from '../../AwesomeButton';
import Modal from './Modal';
import Chip from './Chip';
import { BaseModel } from '@act/data/core';
import { snakeCase } from 'change-case';
import {
  Category,
  TabbedList,
  TabbedListProps as TLP
} from './TabbedList';

export type SelectedOption = {
  id: string;
  display: string;
  categoryId?: string;
  points?: number;
  count?: number;
};

export const Option: FC<{
  value: string;
  title: string;
  subtitle?: string;
  onChange?: (v: boolean, c: number) => void;
  initialValue?: boolean;
  disableSelection: boolean;
  selected?: boolean;
  showCountDropdown?: boolean;
  count?: number;
}> = ({
  title,
  subtitle,
  onChange,
  initialValue,
  disableSelection,
  selected,
  count,
  showCountDropdown = false
}) => {
  const [checked, setChecked] = useState(
    typeof selected !== 'undefined' ? selected : initialValue
  );
  const theme = useTheme();
  const [selectedCount, setSelectedCount] = useState(count);

  const isChecked = (() => {
    if (typeof selected !== 'undefined') {
      return selected;
    }

    return checked;
  })();

  const onPress = () => {
    setChecked((p) => !p);
    onChange?.(!isChecked, selectedCount);
  };

  return (
    <List.Item
      onPress={onPress}
      titleStyle={{ fontSize: 20 }}
      descriptionStyle={{ fontFamily: 'sans-serif' }}
      title={title}
      description={subtitle}
      {...(!disableSelection
        ? {
            left: (props) => (
              <View
                style={{
                  justifyContent: 'center'
                }}
              >
                <Checkbox
                  color={theme.colors.primary}
                  status={isChecked ? 'checked' : 'unchecked'}
                  onPress={onPress}
                />
              </View>
            )
          }
        : {})}
      right={
        showCountDropdown
          ? () => (
              <Picker
                selectedValue={Number(selectedCount).toString()}
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue, itemIndex) => {
                  setSelectedCount(Number(itemValue));
                  onChange?.(isChecked, Number(itemValue));
                }}
              >
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="3" value="3" />
                <Picker.Item label="4" value="4" />
                <Picker.Item label="5" value="5" />
                <Picker.Item label="6" value="6" />
                <Picker.Item label="7" value="7" />
                <Picker.Item label="8" value="8" />
                <Picker.Item label="9" value="9" />
              </Picker>
            )
          : undefined
      }
    />
  );
};

type OptionListProps<T extends BaseModel> = {
  data: T[];
  onChange: (selected: Map<string, SelectedOption>) => void;
  initialSelected: Map<string, SelectedOption>;
  optionTitleProperty: keyof T;
  optionSubtitleProperty?: keyof T;
  selectable?: boolean;
  showCountDropdown?: boolean;
};
const OptionList: <T extends BaseModel>(
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

type CommonSelectorProps = Partial<{
  single: string;
  plural: string;
  title: string;
  subtitle: string;
  icon: string;
  fullHeight?: boolean;
  selectable?: boolean;
  showCountDropdown?: boolean;
  defaultSelected?: Map<string, SelectedOption>;
  showPointCount?: boolean;
}>;

type TabbedSelectorProps<T extends BaseModel, C extends Category> =
  CommonSelectorProps & TLP<T, C>;

type RegularSelectorProps<T> = CommonSelectorProps & {
  data: T[];
  optionTitleProperty: keyof T;
  optionSubtitleProperty?: keyof T;
};

function Selector<T extends BaseModel, C extends Category>(
  props: PropsWithChildren<TabbedSelectorProps<T, C>>
): ReactElement | null;
function Selector<T extends BaseModel>(
  props: PropsWithChildren<RegularSelectorProps<T>>
): ReactElement | null;
function Selector<T extends BaseModel, C extends Category = null>(
  props: CommonSelectorProps &
    TabbedSelectorProps<T, C> &
    RegularSelectorProps<T>
) {
  const {
    data,
    single,
    plural,
    title,
    subtitle,
    icon,
    optionSubtitleProperty,
    optionTitleProperty,
    categories = [],
    fullHeight,
    selectable,
    showCountDropdown,
    defaultSelected,
    showPointCount
  } = props;

  const [selectorModalVisible, setSelectorModalVisible] =
    useState(false);
  const [selected, setSelected] = useState<
    Map<string, SelectedOption>
  >(defaultSelected || new Map());
  const [pendingSelected, setPendingSelected] = useState<
    Map<string, SelectedOption>
  >(new Map());
  const [pendingPointsCount, setPendingPointsCount] =
    useState<number>(0);
  const [pointsCount, setPointsCount] = useState<number>(0);

  const calculatePointsTotal = (s: Map<string, SelectedOption>) =>
    Array.from(s).reduce((acc, ps) => {
      const [id, selectedItem] = ps;
      return (acc +=
        (selectedItem.count || 1) * selectedItem?.points);
    }, 0);

  useEffect(() => {
    if (showPointCount) {
      setPendingPointsCount(calculatePointsTotal(pendingSelected));
    }
  }, [pendingSelected]);

  useEffect(() => {
    if (showPointCount) {
      setPointsCount(calculatePointsTotal(selected));
    }
  }, [selected]);

  return (
    <>
      <Modal
        title={`${single} Selector`}
        subtitle={`Select one or more ${plural.toLocaleLowerCase()} and then select Apply`}
        apply={() => {
          setSelected(pendingSelected);
          setSelectorModalVisible(false);
        }}
        onDismiss={() => setSelectorModalVisible(false)}
        visible={selectorModalVisible}
        fullHeight={fullHeight}
        showPointCount={showPointCount}
        pointsCount={pendingPointsCount}
      >
        {categories.length === 0 && (
          <OptionList
            onChange={setPendingSelected}
            data={data as T[]}
            initialSelected={selected || new Map()}
            optionSubtitleProperty={
              (optionSubtitleProperty as keyof T) || ''
            }
            optionTitleProperty={optionTitleProperty as keyof T}
            selectable={selectable}
            showCountDropdown={showCountDropdown}
          />
        )}
        {categories.length > 0 && (
          <TabbedList
            onChange={setPendingSelected}
            initialSelected={selected}
            data={data}
            categories={categories}
            optionSubtitleProperty={optionSubtitleProperty || ''}
            selectable={selectable}
            optionTitleProperty={optionTitleProperty}
            showCountDropdown={showCountDropdown}
          />
        )}
      </Modal>
      <Card>
        <Card.Title
          title={title}
          subtitle={subtitle}
          left={(props) => <Avatar.Icon {...props} icon={icon} />}
          right={
            showPointCount
              ? () => (
                  <Chip
                    style={{ marginRight: 10 }}
                    title={pointsCount}
                  />
                )
              : undefined
          }
        />
        <Card.Content>
          <View style={{ flexDirection: 'row' }}>
            {Array.from(selected).map((s) => (
              <Chip
                key={`selectedChip.${s[0]}`}
                title={s[1].display}
                count={showPointCount ? s[1].count || 1 : undefined}
                onDelete={() => {
                  setSelected((p) => {
                    const newSelected = new Map(p);
                    newSelected.delete(s[0]);
                    return newSelected;
                  });
                }}
              />
            ))}
          </View>
        </Card.Content>
        <Card.Actions>
          <AwesomeButtonMedium
            onPress={() => setSelectorModalVisible(true)}
          >
            Select {plural}
          </AwesomeButtonMedium>
        </Card.Actions>
      </Card>
    </>
  );
}

export default Selector;
