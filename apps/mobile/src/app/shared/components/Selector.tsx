import { User } from '@act/data/core';
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
import { chain } from 'lodash';
import db from '@act/data/rn';
import { AwesomeButtonMedium } from '../../AwesomeButton';
import Modal from './Modal';
import { RmOptions } from 'node:fs';

type SelectedOption = { id: string; display: string };

const Option: FC<{
  value: string;
  title: string;
  subtitle: string;
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
      titleStyle={{ fontFamily: 'sans-serif' }}
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
type SelectorProps<T> = {
  data: User[];
  onChange: (selected: Map<string, SelectedOption>) => void;
  initialSelected: Map<string, SelectedOption>;
};
const OptionList: <T>(
  p: PropsWithChildren<SelectorProps<T>>
) => ReactElement = ({ data, onChange, initialSelected }) => {
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
          title={d.fullName}
          subtitle={d.username}
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
                display: d.username
              });
              return newSelected;
            })
          }
        />
      ))}
    </Surface>
  );
};

const LeftContent = (props) => (
  <Avatar.Icon {...props} icon="account-box-multiple-outline" />
);

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

const Selector: FC = () => {
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
        apply={() => {
          setSelected(pendingSelected);
          setSelectorModalVisible(false);
        }}
        onDismiss={() => setSelectorModalVisible(false)}
        visible={selectorModalVisible}
      >
        <OptionList<User>
          onChange={setPendingSelected}
          data={db.useCollection<User>('users')}
          initialSelected={selected}
        />
      </Modal>
      <Card>
        <Card.Title
          title="Checkin Users"
          subtitle="Select multiple users to checkin"
          left={LeftContent}
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
            Select Users
          </AwesomeButtonMedium>
        </Card.Actions>
      </Card>
    </>
  );
};
export default Selector;
