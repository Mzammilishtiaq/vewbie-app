import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
} from '@amazon-devices/react-native-kepler';

import ShiftIcon from '../../assets/icons/shift_svgrepo.com.png';
import SpaceIcon from '../../assets/icons/space.png';
import SpaceFocusIcon from '../../assets/icons/space-spacebar-focus.png';
import BackspaceIcon from '../../assets/icons/backspace.png';
import BackspaceFocusIcon from '../../assets/icons/backspace_focus.png';

interface Props {
  onKeyPress?: (key: string) => void;
}

const TVKeyboard: React.FC<Props> = ({onKeyPress}) => {
  const [showSymbols, setShowSymbols] = useState(false);
  const [isShift, setIsShift] = useState(false);

  // store refs of all keys
  const keyRefs = useRef<any[][]>([]);
  const backspaceRef = React.useRef<any>(null);
  const spaceRef = React.useRef<any>(null);
  const doneRef = React.useRef<any>(null);
  const keyboardKeys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '-'],
    [ShiftIcon, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '.', '_'],
  ];

  const symbolKeys = [
    ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
    ['_', '+', '-', '=', '{', '}', '[', ']', ':', ';'],
    ['~', '`', '|', '<', '>', ',', '.', '?', '/', '\\'],
    ['"', "'", '€', '£', '¥', '©', '®', '™', '§', '¶'],
  ];

  const activeKeys = showSymbols
    ? symbolKeys
    : keyboardKeys.map((row) =>
        row.map((k) =>
          typeof k === 'string'
            ? isShift
              ? k.toLowerCase()
              : k.toUpperCase()
            : k,
        ),
      );

  const handleKeyPress = (key: any, row: number, col: number) => {
    if (key === ShiftIcon) {
      setIsShift((prev) => !prev);
      return;
    }

    if (typeof key === 'string') {
      onKeyPress?.(key);

      if (isShift) {
        setIsShift(false);
      }
    }

    // restore focus
    setTimeout(() => {
      keyRefs.current[row]?.[col]?.focus?.();
    }, 0);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
      }}>
      <View>
        {activeKeys.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={{
              flexDirection: 'row',
              gap: 10,
              marginBottom: 10,
            }}>
            {row.map((key, keyIndex) => {
              if (!keyRefs.current[rowIndex]) {
                keyRefs.current[rowIndex] = [];
              }

              return (
                <Pressable
                  key={`${rowIndex}-${keyIndex}`}
                  ref={(el) => {
                    keyRefs.current[rowIndex][keyIndex] = el;
                  }}
                  focusable
                  // hasTVPreferredFocus={rowIndex === 0 && keyIndex === 0}
                  onPress={() => {
                    handleKeyPress(key, rowIndex, keyIndex);
                  }}
                  style={({focused, pressed}) => [
                    {
                      width: 65,
                      height: 78,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 7,
                      backgroundColor: 'rgba(215,215,215,0.2)',
                    },

                    focused && {
                      backgroundColor: '#ffffff',
                      transform: [{scale: 1.1}],
                    },

                    pressed && {
                      backgroundColor: '#ffffff',
                      transform: [{scale: 1.1}],
                    },
                  ]}>
                  {({focused}) =>
                    typeof key === 'string' ? (
                      <Text
                        style={{
                          color: focused ? '#000' : '#fff',
                          fontSize: 28,
                          textAlign: 'center',
                          fontWeight: '600',
                        }}>
                        {key}
                      </Text>
                    ) : (
                      <Image
                        source={key}
                        style={{
                          width: 32,
                          height: 32,
                          tintColor: focused ? '#000' : '#fff',
                        }}
                      />
                    )
                  }
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* SIDE BUTTONS */}

      <View
        style={{
          flexDirection: 'column',
          gap: 10,
        }}>
        <Pressable
          style={({focused}) => [
            {
              width: 140,
              height: 78,
              backgroundColor: 'rgba(215,215,215,0.2)',
              borderRadius: 7,
              alignItems: 'center',
              justifyContent: 'center',
            },

            focused && {
              backgroundColor: '#ffffff',
              transform: [{scale: 1.1}],
            },
          ]}
          onPress={() => setShowSymbols((prev) => !prev)}>
          {({focused}) => (
            <Text
              style={{
                color: focused ? '#000' : '#fff',
                fontSize: 28,
                fontWeight: 'bold',
              }}>
              !#$
            </Text>
          )}
        </Pressable>

        <Pressable
          ref={backspaceRef}
          focusable
          onPress={() => {
            onKeyPress?.('BACKSPACE');
            setTimeout(() => {
              backspaceRef.current?.focus?.();
            }, 0);
          }}
          style={({focused}:any) => [
            {
              width: 140,
              height: 78,
              borderRadius: 7,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(215,215,215,0.2)',
            },

            focused && {
              backgroundColor: '#ffffff',
              transform: [{scale: 1.1}],
            },
          ]}>
          {({focused}:any) =>
            focused ? (
              <Image source={BackspaceFocusIcon} width={34} height={34} />
            ) : (
              <Image source={BackspaceIcon} width={140} height={78} />
            )
          }
        </Pressable>

        <Pressable
          ref={spaceRef}
          focusable
          onPress={() => {
            onKeyPress?.('SPACE');
            setTimeout(() => {
              spaceRef.current?.focus?.();
            }, 0);
          }}
          style={({focused}) => [
            {
              width: 140,
              height: 78,
              borderRadius: 7,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(215,215,215,0.2)',
            },

            focused && {
              backgroundColor: '#ffffff',
              transform: [{scale: 1.1}],
            },
          ]}>
          {({focused}) =>
            focused ? (
              <Image source={SpaceFocusIcon} width={34} height={34} />
            ) : (
              <Image source={SpaceIcon} width={140} height={78} />
            )
          }
        </Pressable>

        <Pressable
  ref={doneRef}
  focusable
  onPress={() => {

    // your Done action here
    console.log('Done pressed');

    // restore focus
    setTimeout(() => {
      doneRef.current?.focus?.();
    }, 0);

  }}
  style={({focused}) => [
    {
      backgroundColor: 'rgba(215,215,215,0.2)',
      width: 140,
      height: 78,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
    },

    focused && {
      backgroundColor: '#ffffff',
      transform: [{scale: 1.1}],
    },
  ]}
>
  {({focused}) => (
    <Text
      style={{
        color: focused ? '#000' : '#fff',
        fontSize: 28,
        fontWeight: 'bold',
      }}>
      Done
    </Text>
  )}
</Pressable>
      </View>
    </View>
  );
};

export default TVKeyboard;