import React, {
  FC,
  useState,
  PropsWithChildren,
  ReactElement,
  useEffect
} from 'react';
import { View } from 'react-native';
import {
  Avatar,
  Card,
  Checkbox,
  Chip,
  List,
  Surface,
  useTheme
} from 'react-native-paper';
import { AwesomeButtonMedium } from '../../AwesomeButton';
import Modal from './Modal';
import { Achievement, BaseModel } from '@act/data/core';
import { snakeCase } from 'change-case';
import {
  Category,
  TabbedSelector,
  TabbedSelectorProps as TSP
} from './TabbedSelector';

type SelectedOption = { id: string; display: string };

export const Option: FC<{
  value: string;
  title: string;
  subtitle?: string;
  onChange: (v: boolean) => void;
  initialValue: boolean;
}> = ({ title, subtitle, onChange, initialValue }) => {
  const [checked, setChecked] = useState(initialValue);
  const theme = useTheme();

  const onPress = () => {
    setChecked((p) => !p);
    onChange?.(!checked);
  };

  return (
    <List.Item
      onPress={onPress}
      titleStyle={{ fontSize: 20 }}
      descriptionStyle={{ fontFamily: 'sans-serif' }}
      title={title}
      description={subtitle}
      left={(props) => (
        <View
          style={{
            justifyContent: 'center'
          }}
        >
          <Checkbox
            color={theme.colors.primary}
            status={checked ? 'checked' : 'unchecked'}
            onPress={onPress}
          />
        </View>
      )}
    />
  );
};

type OptionListProps<T extends BaseModel> = {
  data: T[];
  onChange: (selected: Map<string, SelectedOption>) => void;
  initialSelected: Map<string, SelectedOption>;
  optionTitleProperty: keyof T;
  optionSubtitleProperty: keyof T;
};
const OptionList: <T extends BaseModel>(
  p: PropsWithChildren<OptionListProps<T>>
) => ReactElement = ({
  data,
  onChange,
  initialSelected,
  optionSubtitleProperty,
  optionTitleProperty
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
          key={d.id}
          value={d.id}
          title={d[snakeCase(optionTitleProperty as string)]}
          subtitle={d[snakeCase(optionSubtitleProperty as string)]}
          initialValue={initialSelected.has(d.id)}
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
                display: d[snakeCase(optionTitleProperty as string)]
              });
              return newSelected;
            })
          }
        />
      ))}
    </Surface>
  );
};

const SelectedChip = ({ title, onDelete }) => {
  const theme = useTheme();
  return (
    <Chip
      style={{
        borderWidth: 1,
        margin: 2,
        borderColor: theme.colors.primary
      }}
      textStyle={{
        fontFamily: 'sans-serif',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center'
      }}
      mode="outlined"
      onClose={onDelete}
    >
      {title}
    </Chip>
  );
};

type AllProps = Partial<{
  type: TType;
  name: string;
  points: number;
}>;
type TType = 'string' | 'number';
export function Image(props: {
  type: 'string';
  name: string;
}): React.ReactElement;
export function Image(props: {
  type: 'number';
  points: number;
}): React.ReactElement;
export function Image(props: AllProps) {
  if (props.type === 'number') {
    const b = props.name;
  }
  // Imagine there is some logic to handle these props
  return <div>placeholder</div>;
}

const b = () => {
  <>
    <Image type={'number'} points={3} />
    <Image type={'string'} name={'eef'} />
  </>;
};

type CommonSelectorProps = Partial<{
  single: string;
  plural: string;
  title: string;
  subtitle: string;
  icon: string;
}>;

type TabbedSelectorProps<T extends BaseModel, C extends Category> =
  CommonSelectorProps & TSP<T, C>;

type RegularSelectorProps<T> = CommonSelectorProps & {
  data: T[];
  optionTitleProperty: keyof T;
  optionSubtitleProperty: keyof T;
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
    categories = []
  } = props;

  const [selectorModalVisible, setSelectorModalVisible] =
    useState(false);
  const [selected, setSelected] = useState<
    Map<string, SelectedOption>
  >(new Map());
  const [pendingSelected, setPendingSelected] = useState<
    Map<string, SelectedOption>
  >(new Map());

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
        fullHeight={categories.length > 0}
      >
        {categories.length === 0 && (
          <OptionList
            onChange={setPendingSelected}
            data={data as T[]}
            initialSelected={selected}
            optionSubtitleProperty={optionSubtitleProperty as keyof T}
            optionTitleProperty={optionTitleProperty as keyof T}
          />
        )}
        {categories.length > 0 && (
          <TabbedSelector
            data={data}
            categories={categories}
            optionSubtitleProperty={optionSubtitleProperty}
            optionTitleProperty={optionTitleProperty}
          />
        )}
      </Modal>
      <Card>
        <Card.Title
          title={title}
          subtitle={subtitle}
          left={(props) => <Avatar.Icon {...props} icon={icon} />}
        />
        <Card.Content>
          <View style={{ flexDirection: 'row' }}>
            {Array.from(selected).map((s) => (
              <SelectedChip
                key={`selectedChip.${s[0]}`}
                title={s[1].display}
                onDelete={() =>
                  setSelected((p) => {
                    const newSelected = new Map(p);
                    newSelected.delete(s[0]);
                    return newSelected;
                  })
                }
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
