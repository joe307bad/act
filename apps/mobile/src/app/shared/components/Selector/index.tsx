import React, {
  useState,
  PropsWithChildren,
  ReactElement,
  useEffect
} from 'react';
import { Pressable, Text, View, ViewBase } from 'react-native';
import { Avatar, Card, Surface, useTheme } from 'react-native-paper';
import { AwesomeButtonMedium } from '../../../AwesomeButton';
import Modal from '../Modal';
import Chip from '../Chip';
import { BaseModel } from '@act/data/core';
import {
  Category,
  TabbedList,
  TabbedListProps as TLP
} from '../TabbedList';
import { OptionList } from './OptionList';
import { useDebounce } from '../../hooks/useDebounce';
import { isEmpty } from 'lodash';
import {
  Column,
  Columns,
  Inline,
  Stack,
  Tiles
} from '@mobily/stacks';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export type SelectedOption = {
  id: string;
  display: string;
  categoryId?: string;
  points?: number;
  count?: number;
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
  inlineTags?: boolean;
  showInfoButton?: boolean;
  onInfoButtonPress?: () => void;
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
    showPointCount,
    inlineTags,
    showInfoButton,
    onInfoButtonPress
  } = props;

  const theme = useTheme();
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
  const [searchCriteria, setSearchCriteria] = useState<string>('');
  const [hiddenOptions, setHiddenOptions] = useState(
    new Set<string>()
  );
  const debouncedSearchCriteria = useDebounce(searchCriteria, 500);

  const calculatePointsTotal = (s: Map<string, SelectedOption>) =>
    Array.from(s).reduce((acc, ps) => {
      const [id, selectedItem] = ps;
      return (acc +=
        (selectedItem.count || 1) * selectedItem?.points);
    }, 0);

  const debouncedPendingSelected = useDebounce(pendingSelected, 500);

  useEffect(() => {
    if (showPointCount) {
      setPendingPointsCount(calculatePointsTotal(pendingSelected));
    }
  }, [debouncedPendingSelected]);

  useEffect(() => {
    if (showPointCount) {
      setPointsCount(calculatePointsTotal(selected));
    }
  }, [selected]);

  useEffect(() => {
    if (isEmpty(debouncedSearchCriteria)) {
      setHiddenOptions(new Set());
    } else {
      setHiddenOptions(
        new Set(
          data
            .filter(
              (a) =>
                a.name
                  .toUpperCase()
                  .search(debouncedSearchCriteria.toUpperCase()) ===
                -1
            )
            .map((a) => a.id)
        )
      );
    }
  }, [debouncedSearchCriteria, data]);

  const listType =
    categories.length === 0 ? 'OPTION_LIST' : 'TABBED_LIST';

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
        showSearchBar={listType === 'TABBED_LIST'}
        searchCriteria={searchCriteria}
        onSearchChange={setSearchCriteria}
      >
        {listType === 'OPTION_LIST' && (
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
        {listType === 'TABBED_LIST' && (
          <TabbedList
            onChange={setPendingSelected}
            initialSelected={selected}
            data={data}
            categories={categories}
            optionSubtitleProperty={optionSubtitleProperty || ''}
            selectable={selectable}
            optionTitleProperty={optionTitleProperty}
            showCountDropdown={showCountDropdown}
            hiddenOptions={hiddenOptions}
            showInfoButton={showInfoButton}
            onInfoButtonPress={onInfoButtonPress}
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
                    title={pointsCount.toLocaleString()}
                  />
                )
              : undefined
          }
        />
        <Card.Content style={{ display: 'flex' }}>
          {inlineTags ? (
            <Inline space={2}>
              {Array.from(selected).map((s, i) => (
                <Surface key={i} style={{ elevation: 3 }}>
                  <Columns
                    space={1}
                    style={{
                      padding: 5
                    }}
                  >
                    <Column width="content">
                      <Text>{s[1].display}</Text>
                    </Column>
                    <Column
                      width="content"
                      height="fluid"
                      style={{
                        justifyContent: 'center',
                        paddingRight: 5
                      }}
                    >
                      <Pressable
                        onPress={() => {
                          setSelected((p) => {
                            const newSelected = new Map(p);
                            newSelected.delete(s[0]);
                            return newSelected;
                          });
                        }}
                      >
                        <MaterialCommunityIcons
                          name="close-circle"
                          color={theme.colors.primary}
                          size={20}
                        />
                      </Pressable>
                    </Column>
                  </Columns>
                </Surface>
              ))}
            </Inline>
          ) : (
            <Stack space={2}>
              {Array.from(selected).map((s, i) => (
                <Surface key={i} style={{ elevation: 3 }}>
                  <Columns
                    space={2}
                    style={{
                      padding: 4
                    }}
                  >
                    {showPointCount && (
                      <Column
                        width="content"
                        height="fluid"
                        style={{
                          justifyContent: 'center'
                        }}
                      >
                        <MaterialCommunityIcons
                          name={`numeric-${s[1].count}-box`}
                          color={theme.colors.primary}
                          size={25}
                        />
                      </Column>
                    )}
                    <Column>
                      <Text numberOfLines={3}>{s[1].display}</Text>
                    </Column>
                    <Column
                      width="content"
                      height="fluid"
                      style={{
                        justifyContent: 'center',
                        paddingRight: 5
                      }}
                    >
                      <Pressable
                        onPress={() => {
                          setSelected((p) => {
                            const newSelected = new Map(p);
                            newSelected.delete(s[0]);
                            return newSelected;
                          });
                        }}
                      >
                        <MaterialCommunityIcons
                          name="close-circle"
                          color={theme.colors.primary}
                          size={20}
                        />
                      </Pressable>
                    </Column>
                  </Columns>
                </Surface>
              ))}
            </Stack>
          )}
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
