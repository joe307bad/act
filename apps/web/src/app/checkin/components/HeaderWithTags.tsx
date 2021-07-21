import React, { useEffect, useState } from 'react';
import * as MUI from '@material-ui/core';
import * as Icons from '@material-ui/icons';

export const HeaderWithTags = ({
  title,
  selected,
  onChange,
  showCount = false
}) => {
  return (
    <div
      style={{
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        paddingBottom: 10
      }}
    >
      <h2 style={{ paddingRight: 10 }}>{title}</h2>
      <div style={{ flex: 1 }}>
        {Array.from(selected).map(([id, sa]) => (
          <MUI.Chip
            avatar={
              <MUI.Avatar>{showCount ? sa?.count : null}</MUI.Avatar>
            }
            key={id}
            label={sa?.name ?? ''}
            style={{ marginRight: 10 }}
            onDelete={() => {
              const newSelected = new Map(selected);
              newSelected.delete(id);
              onChange(newSelected);
            }}
          />
        ))}
      </div>
      {showCount && (
        <MUI.Chip
          color="primary"
          icon={<Icons.Add />}
          label={Array.from(selected).reduce(
            (acc: number, sa) =>
              sa[1] !== null
                ? (acc += (sa[1].count ?? 1) * sa[1].points)
                : 1,
            0
          )}
        />
      )}
    </div>
  );
};
