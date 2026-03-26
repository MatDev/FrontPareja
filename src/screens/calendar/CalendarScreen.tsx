import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../theme';
import { calendarApi, MenstrualCycleResponse, MenstrualCyclePredictionResponse } from '../../api/calendar';
import { useCoupleStore } from '../../store/coupleStore';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const CalendarScreen: React.FC = () => {
  const { colors, fontSize, fontWeight, spacing } = useTheme();
  const { coupleId } = useCoupleStore();
  const [currentCycle, setCurrentCycle] = useState<MenstrualCycleResponse | null>(null);
  const [prediction, setPrediction] = useState<MenstrualCyclePredictionResponse | null>(null);
  const [tab, setTab] = useState<'cycle' | 'activity'>('cycle');

  useEffect(() => {
    if (!coupleId) return;
    calendarApi.cycles.current(coupleId).then(setCurrentCycle).catch(() => {});
    calendarApi.cycles.prediction(coupleId).then(setPrediction).catch(() => {});
  }, [coupleId]);

  if (!coupleId) {
    return (
      <Screen contentStyle={{ alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
        <Ionicons name="heart-outline" size={48} color={colors.textDisabled} />
        <Text style={{ color: colors.textSecondary }}>Conecta con tu pareja primero</Text>
      </Screen>
    );
  }

  return (
    <Screen scroll edges={['top']}>
      <Text
        style={{
          color: colors.text,
          fontSize: fontSize.xl,
          fontWeight: fontWeight.bold,
          marginBottom: spacing.lg,
        }}
      >
        Calendario
      </Text>

      {/* Segmented control */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 4,
          marginBottom: spacing.lg,
        }}
      >
        {(['cycle', 'activity'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              borderRadius: 10,
              alignItems: 'center',
              backgroundColor: tab === t ? colors.primary : 'transparent',
            }}
          >
            <Text
              style={{
                color: tab === t ? '#FFF' : colors.textSecondary,
                fontWeight: fontWeight.medium,
                fontSize: fontSize.sm,
              }}
            >
              {t === 'cycle' ? '🌸 Ciclo' : '❤️ Actividad'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'cycle' ? (
        <View style={{ gap: spacing.md }}>
          {currentCycle ? (
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
                <Ionicons name="water" size={22} color={colors.primary} />
                <Text style={{ color: colors.text, fontWeight: fontWeight.semibold, fontSize: fontSize.lg }}>
                  Ciclo actual
                </Text>
              </View>
              <View style={{ gap: spacing.xs }}>
                <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm }}>
                  Inicio:{' '}
                  <Text style={{ color: colors.text }}>
                    {format(parseISO(currentCycle.startDate), "d 'de' MMMM", { locale: es })}
                  </Text>
                </Text>
                {currentCycle.endDate ? (
                  <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm }}>
                    Fin:{' '}
                    <Text style={{ color: colors.text }}>
                      {format(parseISO(currentCycle.endDate), "d 'de' MMMM", { locale: es })}
                    </Text>
                  </Text>
                ) : null}
                <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm }}>
                  Duración:{' '}
                  <Text style={{ color: colors.text }}>
                    {currentCycle.approximateDurationDays ?? '—'} días
                  </Text>
                </Text>
              </View>
            </Card>
          ) : (
            <Card style={{ alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl }}>
              <Ionicons name="water-outline" size={36} color={colors.textDisabled} />
              <Text style={{ color: colors.textSecondary }}>No hay ciclo registrado</Text>
              <Button label="Registrar ciclo" onPress={() => {}} variant="outline" size="sm" />
            </Card>
          )}

          {prediction ? (
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
                <Ionicons name="calendar" size={22} color={colors.secondary} />
                <Text style={{ color: colors.text, fontWeight: fontWeight.semibold, fontSize: fontSize.lg }}>
                  Próximo ciclo
                </Text>
              </View>
              <Text style={{ color: colors.primary, fontSize: fontSize['2xl'], fontWeight: fontWeight.bold }}>
                {format(parseISO(prediction.predictedDate), "d 'de' MMMM", { locale: es })}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs }}>
                Duración media: {prediction.averageCycleDuration} días · Basado en{' '}
                {prediction.analyzedCycles} ciclos
              </Text>
            </Card>
          ) : null}
        </View>
      ) : (
        <View style={{ alignItems: 'center', gap: spacing.md, paddingTop: spacing.xl }}>
          <Ionicons name="heart-circle-outline" size={56} color={colors.textDisabled} />
          <Text style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }}>
            Actividad de pareja
          </Text>
          <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
            Registra vuestra actividad íntima de forma privada
          </Text>
          <Button label="Registrar actividad" onPress={() => {}} variant="primary" size="lg" />
        </View>
      )}
    </Screen>
  );
};
