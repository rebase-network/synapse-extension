import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'formik';
import { Button, TextField } from '@material-ui/core';

const UDTForm = (props: any) => {
  const intl = useIntl();

  const { values, touched, errors, handleChange, handleBlur, handleSubmit } = props;

  return (
    <Form
      className="manage-contacts"
      id="manage-contacts"
      onSubmit={handleSubmit}
      aria-label="form"
    >
      <TextField
        size="small"
        label={intl.formatMessage({ id: 'UDT Name' })}
        id="name"
        name="name"
        type="text"
        fullWidth
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.name}
        helperText={errors.name && touched.name && errors.name}
        margin="normal"
        variant="outlined"
        data-testid="field-name"
      />
      <TextField
        size="small"
        label={intl.formatMessage({ id: 'UDT Hash' })}
        id="typeHash"
        name="typeHash"
        type="text"
        fullWidth
        value={values.typeHash}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.typeHash}
        helperText={errors.typeHash && touched.typeHash && errors.typeHash}
        margin="normal"
        variant="outlined"
        data-testid="field-typeHash"
      />
      <TextField
        size="small"
        label={intl.formatMessage({ id: 'Decimal' })}
        id="decimal"
        name="decimal"
        type="text"
        fullWidth
        value={values.decimal}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.decimal}
        helperText={errors.decimal && touched.decimal && errors.decimal}
        margin="normal"
        variant="outlined"
        data-testid="field-decimal"
      />
      <TextField
        size="small"
        label={intl.formatMessage({ id: 'Symbol' })}
        id="symbol"
        name="symbol"
        type="text"
        fullWidth
        value={values.symbol}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.symbol}
        helperText={errors.symbol && touched.symbol && errors.symbol}
        margin="normal"
        variant="outlined"
        data-testid="field-symbol"
      />
      <Button
        type="submit"
        id="submit-button"
        color="primary"
        variant="contained"
        data-testid="submit-button"
      >
        <FormattedMessage id="Confirm" />
      </Button>
    </Form>
  );
};

export default UDTForm;
