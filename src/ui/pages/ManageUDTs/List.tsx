import React from 'react';
import _ from 'lodash';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { ListItem, ListItemText, List } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { truncateHash } from '@src/common/utils/formatters';
import { useHistory } from 'react-router-dom';

export default function UDTList() {
  const history = useHistory();
  const [udtsItems, setUdtsItems] = React.useState([]);
  React.useEffect(() => {
    browser.storage.local.get('udts').then((result) => {
      if (Array.isArray(result.udts)) {
        setUdtsItems(result.udts);
      }
    });
  }, []);

  const handleDelete = async (event, typeHash) => {
    let udtsObj = [];
    const udtsStorage = await browser.storage.local.get('udts');
    if (Array.isArray(udtsStorage.udts)) {
      udtsObj = udtsStorage.udts;
    }
    _.remove(udtsObj, function removeItem(contact) {
      return contact.typeHash === typeHash;
    });
    setUdtsItems(udtsObj);
    await browser.storage.local.set({ udts: udtsObj });
  };

  const handleEdit = async (event, typeHash) => {
    history.push(`/udts/edit/${typeHash}`);
  };

  const udtsElem = udtsItems.map((item) => {
    const secondaryItem = `${item.name} - ${item.decimal} - ${item.symbol}`;
    return (
      <List component="nav" aria-label="udts List" key={`item-${item.typeHash}`}>
        <ListItem>
          <ListItemText primary={truncateHash(item.typeHash)} secondary={secondaryItem} />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={(event) => handleEdit(event, item.typeHash)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(event) => handleDelete(event, item.typeHash)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
  });

  return <>{udtsElem}</>;
}
