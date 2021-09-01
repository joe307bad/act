import React, {
  useState,
  PropsWithChildren,
  ReactElement,
  useEffect
} from 'react';
import { GestureResponderEvent, Pressable, Text } from 'react-native';
import { Avatar, Card, Surface, useTheme } from 'react-native-paper';
import { AwesomeButtonMedium } from '../../../AwesomeButton';
import Modal from '../Modal';
import Chip from '../Chip';
import { Achievement, BaseModel } from '@act/data/core';
import {
  Category,
  TabbedList,
  TabbedListProps as TLP
} from '../TabbedList';
import { OptionList } from './OptionList';
import { useDebounce } from '../../hooks/useDebounce';
import { isEmpty } from 'lodash';
import { Column, Columns, Inline, Stack } from '@mobily/stacks';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalContext } from '../../../core/providers/GlobalContextProvider';

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
  defaultSelected?: string[];
  showPointCount?: boolean;
  inlineTags?: boolean;
  showInfoButton?: boolean;
  onInfoButtonPress?: () => void;
  onSelectorChange?: (
    selectedItems: string[] | Map<string, number>,
    points?: number
  ) => void;
  value?: any;
  type?: 'TABBED_LIST' | 'OPTIONS_LIST';
}>;

type TabbedSelectorProps<T extends BaseModel, C extends Category> =
  CommonSelectorProps & TLP<T, C>;

type RegularSelectorProps<T> = CommonSelectorProps & {
  data?: T[];
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
    fullHeight,
    selectable,
    showCountDropdown,
    defaultSelected,
    showPointCount,
    inlineTags,
    showInfoButton,
    onSelectorChange,
    value,
    type = 'OPTIONS_LIST'
  } = props;
  const theme = useTheme();
  const { fullNamesByUser } = useGlobalContext();
  const [selectorModalVisible, setSelectorModalVisible] =
    useState(false);
  const [selected, setSelected] = useState<
    Map<string, SelectedOption> | string[]
  >(value || []);
  const [pendingSelected, setPendingSelected] = useState<
    Map<string, SelectedOption> | string[]
  >(new Map());
  const [pendingPointsCount, setPendingPointsCount] =
    useState<number>(0);
  const [pointsCount, setPointsCount] = useState<number>(0);
  const [searchCriteria, setSearchCriteria] = useState<string>('');
  const [hiddenOptions, setHiddenOptions] = useState(
    new Set<string>()
  );
  const debouncedSearchCriteria = useDebounce(searchCriteria, 500);
  const [selectedInfo, setSelectedInfo] = useState<{
    name?: string;
    description?: string;
  }>({});
  const [resetting, setResetting] = useState(false);

  const calculatePointsTotal = (s: Map<string, SelectedOption>) =>
    Array.from(s || []).reduce((acc, ps) => {
      const [id, selectedItem] = ps;
      return (acc +=
        (selectedItem.count || 1) * selectedItem?.points);
    }, 0);

  const debouncedPendingSelected = useDebounce(pendingSelected, 500);

  useEffect(() => {
    if (showPointCount) {
      setPendingPointsCount(
        calculatePointsTotal(
          pendingSelected as Map<string, SelectedOption>
        )
      );
    }
  }, [debouncedPendingSelected]);

  useEffect(() => {
    if (resetting) {
      setResetting(false);
      return;
    }

    if (showPointCount) {
      const achievementSelections = selected as Map<
        string,
        SelectedOption
      >;
      const points = calculatePointsTotal(achievementSelections);
      setPointsCount(points);
      type === 'TABBED_LIST' &&
        onSelectorChange(
          new Map(
            Array.from(achievementSelections).map(
              ([id, selectedOption]) => [id, selectedOption.count]
            )
          ),
          points
        );
    }
    type === 'OPTIONS_LIST' && onSelectorChange(selected as string[]);
  }, [selected]);

  useEffect(() => {
    if (
      typeof value !== 'undefined' &&
      type === 'TABBED_LIST' &&
      value?.size === 0
    ) {
      setResetting(true);
      setPointsCount(0);
      setPendingPointsCount(0);
      setSelected(new Map());
    }

    if (type === 'OPTIONS_LIST' && typeof value !== 'undefined') {
      setSelected(value);
    }
  }, [value]);

  const { achievementsByCategory } = useGlobalContext();

  useEffect(() => {
    if (isEmpty(debouncedSearchCriteria)) {
      setHiddenOptions(new Set());
    } else {
      const achievements = Array.from(
        achievementsByCategory.get('all')?.values()
      );
      setHiddenOptions(
        new Set(
          achievements
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
  }, [debouncedSearchCriteria]);

  const onTabbedListChange = (
    selectedAchievements: Map<string, Achievement>,
    itemsCount: Map<string, number>
  ) => {
    setPendingSelected(
      new Map(
        Array.from(selectedAchievements).map(([id, a]) => {
          return [
            id,
            {
              id,
              display: a.name,
              points: a.points,
              count: itemsCount.get(id) ?? 1
            }
          ];
        })
      )
    );
  };

  const onOptionsListChange = (
    selectedOptions: Map<string, any> | string[]
  ) => {
    setPendingSelected(selectedOptions);
  };

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
        showSearchBar={type === 'TABBED_LIST'}
        searchCriteria={searchCriteria}
        onSearchChange={setSearchCriteria}
        selectedItemTitle={selectedInfo.name}
        selectedItemDescription={selectedInfo.description}
        closeSelectedItemInfo={() => setSelectedInfo({})}
      >
        {type === 'OPTIONS_LIST' && (
          <OptionList
            defaultSelected={value}
            onChange={onOptionsListChange}
            data={data as T[]}
            optionSubtitleProperty={
              (optionSubtitleProperty as keyof T) || ''
            }
            optionTitleProperty={optionTitleProperty as keyof T}
            selectable={selectable}
            showCountDropdown={showCountDropdown}
          />
        )}
        {type === 'TABBED_LIST' && (
          <TabbedList
            onChange={onTabbedListChange}
            initialSelected={selected as Map<string, SelectedOption>}
            optionSubtitleProperty={optionSubtitleProperty || ''}
            selectable={selectable}
            optionTitleProperty={optionTitleProperty}
            showCountDropdown={showCountDropdown}
            hiddenOptions={hiddenOptions}
            showInfoButton={showInfoButton}
            setSelectedInfo={(name, description) =>
              setSelectedInfo({ name, description })
            }
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
          {type === 'OPTIONS_LIST' ? (
            <Inline space={2}>
              {((selected as string[]) || []).map((s, i) => {
                return (
                  <Surface key={i} style={{ elevation: 3 }}>
                    <Columns
                      space={1}
                      style={{
                        padding: 5
                      }}
                    >
                      <Column width="content">
                        <Text>{fullNamesByUser.get(s)}</Text>
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
                              const newSelected = new Set(
                                p as string[]
                              );
                              newSelected.delete(s);
                              return Array.from(newSelected);
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
                );
              })}
            </Inline>
          ) : (
            <Stack space={2}>
              {Array.from(
                (selected as Map<string, SelectedOption>) || []
              ).map((s, i) => {
                const [display, count] = (() => {
                  return [s[1].display, s[1].count];
                })();
                return (
                  <Surface key={i} style={{ elevation: 3 }}>
                    <Columns
                      space={2}
                      style={{
                        padding: 4
                      }}
                      alignY="center"
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
                            name={`numeric-${count}-box`}
                            color={theme.colors.primary}
                            size={25}
                          />
                        </Column>
                      )}
                      <Column>
                        <Text numberOfLines={3}>{display}</Text>
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
                              const newSelected = new Map(
                                p as Map<string, SelectedOption>
                              );
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
                );
              })}
            </Stack>
          )}
        </Card.Content>
        <Card.Actions>
          <AwesomeButtonMedium
            type="outlined"
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
