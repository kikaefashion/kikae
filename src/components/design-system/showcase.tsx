import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { colorScheme } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Chip } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Price } from '@/components/ui/price';
import { Radio } from '@/components/ui/radio';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Text, type TextVariant } from '@/components/ui/text';
import { roles, type as typeScale } from '@/theme/tokens';

type Mode = 'system' | 'light' | 'dark';

const textVariants: TextVariant[] = [
  'display',
  'title-1',
  'title-2',
  'title-3',
  'headline',
  'body',
  'callout',
  'subhead',
  'footnote',
  'caption',
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-12">
      <Text variant="title-3" color="fg">
        {title}
      </Text>
      {children}
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-row flex-wrap items-center gap-8">{children}</View>
  );
}

export default function DesignSystemContent() {
  const [mode, setMode] = useState<Mode>('system');
  const changeMode = (next: Mode) => {
    setMode(next);
    colorScheme.set(next);
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 32 }}>
        <View className="gap-8">
          <Text variant="title-1" color="fg">
            Design system
          </Text>
          <Text variant="callout" color="fg-muted">
            Dev-only preview of every primitive. Icons follow the system scheme;
            surfaces and text follow the toggle below.
          </Text>
        </View>

        <Row>
          {(['system', 'light', 'dark'] as const).map((option) => (
            <Button
              key={option}
              variant={mode === option ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => changeMode(option)}
            >
              {option}
            </Button>
          ))}
        </Row>

        <Section title="Color tokens">
          <View className="flex-row flex-wrap gap-8">
            {Object.entries(roles.light).map(([name, hex]) => (
              <View key={name} className="w-1/2 flex-row items-center gap-8">
                <View
                  className="h-32 w-32 rounded-xs border border-line"
                  style={{ backgroundColor: hex }}
                />
                <View className="flex-1">
                  <Text variant="footnote" color="fg">
                    {name}
                  </Text>
                  <Text variant="caption" color="fg-muted">
                    {hex}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Type scale">
          <View className="gap-8">
            {textVariants.map((variant) => (
              <Text key={variant} variant={variant} color="fg">
                {variant} · {typeScale[variant].size}px
              </Text>
            ))}
          </View>
        </Section>

        <Section title="Button">
          <Row>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="text">Text</Button>
            <Button variant="danger" icon="trash">
              Delete
            </Button>
          </Row>
          <Row>
            <Button size="sm" icon="cart">
              Small
            </Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </Row>
          <Button size="lg" icon="cart">
            Add to cart
          </Button>
        </Section>

        <Section title="IconButton">
          <Row>
            <IconButton icon="heart-outline" label="Add to wishlist" />
            <IconButton icon="cart" label="Cart" />
            <IconButton icon="close" label="Close" disabled />
          </Row>
        </Section>

        <Section title="Input">
          <View className="gap-16">
            <Input
              label="Email"
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Input label="Password" error="Must be at least 8 characters" />
            <Input label="Disabled" editable={false} value="Locked" />
            <Input label="Boxed" boxed placeholder="Search" />
          </View>
        </Section>

        <Section title="Selection controls">
          <Row>
            <Checkbox checked label="Agree" onValueChange={() => {}} />
            <Checkbox
              checked={false}
              disabled
              label="Disabled"
              onValueChange={() => {}}
            />
          </Row>
          <Row>
            <Radio checked label="Standard" onValueChange={() => {}} />
            <Radio checked={false} label="Express" onValueChange={() => {}} />
          </Row>
          <Row>
            <Switch checked label="Notifications" onValueChange={() => {}} />
            <Switch checked={false} label="Off" onValueChange={() => {}} />
          </Row>
        </Section>

        <Section title="Chip">
          <Row>
            <Chip role="filter" label="In stock" selected />
            <Chip role="filter" label="On sale" />
            <Chip role="category" label="Fashion" />
            <Chip role="tab" label="Products" selected />
            <Chip role="tab" label="Makeup" />
          </Row>
        </Section>

        <Section title="Badge">
          <Row>
            <Badge count={5} />
            <Badge count={120} />
            <Badge status="success" icon="checkmark-circle" label="In stock" />
            <Badge status="error" icon="alert-circle" label="Out of stock" />
          </Row>
        </Section>

        <Section title="Avatar">
          <Row>
            <Avatar size={24} name="Ada Lovelace" />
            <Avatar size={32} name="Kikae" />
            <Avatar size={40} name="Ada Lovelace" />
            <Avatar size={56} name="Ada Lovelace" />
            <Avatar size={96} />
          </Row>
        </Section>

        <Section title="Skeleton">
          <View className="gap-16">
            <Skeleton shape="row" />
            <Skeleton shape="card" />
            <Skeleton shape="text" lines={2} />
            <Skeleton shape="banner" />
          </View>
        </Section>

        <Section title="Price">
          <Row>
            <Price amount={12500} />
            <Price amount={12500} emphasis variant="title-2" />
          </Row>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
