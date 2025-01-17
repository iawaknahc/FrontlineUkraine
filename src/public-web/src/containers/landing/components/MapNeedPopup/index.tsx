import React, { useMemo } from 'react';
import { Need } from '../../../../models/need';
import {
  getPpeStatusEnumFromInt,
  PpeStatus,
} from '../../../../models/ppeStatus';
import { PpeTypeEnumLabel } from '../PpeTypeEnumLabel';
import { getPpeTypeEnumFromInt, PpeTypeEnum } from '../../../../models/ppeType';
import { CategoryEnum } from '../../type';
import { useStyles } from './style';

interface Props {
  need: Need;
  allowStatuses: PpeStatus[];
  variant: CategoryEnum.Need | CategoryEnum.NeedMet;
}

export const MapNeedPopup: React.FC<Props> = ({
  need,
  allowStatuses,
  variant,
}) => {
  const { classes, cx } = useStyles();
  const allowStatusesSet = useMemo(
    () => new Set<PpeStatus>(allowStatuses),
    [allowStatuses]
  );
  const { title, otherPpeTitle, ppeTypeTitle } = useMemo(() => {
    switch (variant) {
      case CategoryEnum.Need:
        return {
          title: 'Needs Post',
          ppeTypeTitle: 'Needs',
          otherPpeTitle: 'Other Needs',
        };
      case CategoryEnum.NeedMet:
        return {
          title: 'Met Needs',
          ppeTypeTitle: 'Needs Met',
          otherPpeTitle: 'Other Needs Met',
        };
      default:
        return {
          title: 'Unknown',
          ppeTypeTitle: 'Unknown',
          otherPpeTitle: 'Unknown',
        };
    }
  }, [variant]);
  const otherTypePpeType = useMemo(() => {
    const otherTypePpeType = need.ppeTypes.find(
      ({ ppeType }) => PpeTypeEnum.Other === getPpeTypeEnumFromInt(ppeType)
    );
    if (otherTypePpeType == null) {
      return null;
    }
    const status = getPpeStatusEnumFromInt(otherTypePpeType.status);
    if (
      status == null ||
      !allowStatusesSet.has(status) ||
      otherTypePpeType.ppeTypeOther == null
    ) {
      return null;
    }
    return otherTypePpeType;
  }, [allowStatusesSet, need.ppeTypes]);
  const { datetime } = useMemo(
    () => ({
      datetime: new Date(need.datetime),
    }),
    [need]
  );
  return (
    <div
      className={cx(classes.container, {
        [classes.need]: variant === CategoryEnum.Need,
        [classes.needMet]: variant === CategoryEnum.NeedMet,
      })}
    >
      <h1>{title}</h1>
      <dl>
        <dt>Postcode:</dt>
        <dd>{need.postcode}</dd>
        <dt>Organisation:</dt>
        <dd>{need.organisation}</dd>
        <dt>{ppeTypeTitle}:</dt>
        <dd>
          <ul>
            {need.ppeTypes
              .filter(({ status: ordValue }) => {
                const status = getPpeStatusEnumFromInt(ordValue);
                return status != null && allowStatusesSet.has(status);
              })
              .map(({ ppeType }) => (
                <li key={ppeType}>
                  <PpeTypeEnumLabel
                    ppeType={getPpeTypeEnumFromInt(ppeType)!}
                    variant="compact"
                  />
                </li>
              ))}
          </ul>
        </dd>
        {otherTypePpeType && (
          <>
            <dt>{otherPpeTitle}</dt>
            <dd>{otherTypePpeType.ppeTypeOther}</dd>
          </>
        )}
      </dl>
      <div
        className={classes.datetime}
        title={`Received ${datetime.toLocaleString()}`}
      >
        {datetime.toLocaleString()}
      </div>
    </div>
  );
};
